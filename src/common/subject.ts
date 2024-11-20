//定义订阅对象的接口，包含用于取消订阅的方法
export interface Subscription {
  unsubscribe: () => void;
}

//维护一个订阅者列表
export class Subject<T> {
  private map = new Map<Symbol, (value: T) => void>(); //存储订阅者 键为Symbol，值为回调函数

  //next方法，向所有的回调函数发送参数value
  next(value: T): void {
    const map = this.map;
    map.forEach((f) => {
      f(value);
    });
  }

  //订阅，将f作为值加入map
  subscribe(f: (value: T) => void): Subscription {
    const map = this.map;
    const key = Symbol();
    map.set(key, f);

    //取消订阅接口（得订阅了才能取消对吧）
    return {
      unsubscribe: () => {
        map.delete(key);
      },
    };
  }
}

//使用实例
/*
const subject = new Subject<number>();  //声明一个订阅者列表

const subscription = subject.subscribe((value) => {
  console.log(`Received value: ${value}`);
}); //定义了一个回调函数

subject.next(1); // 输出: Received value: 1
subject.next(2); // 输出: Received value: 2

subscription.unsubscribe();

subject.next(3); // 无输出


在实际的应用中，发布者发布新的消息后，使用回调函数对所有订阅者进行操作
 */
