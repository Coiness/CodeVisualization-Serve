import { ChangeSet } from "../diff/objDiff";

export interface Action {
  type: string;
  id: string;
  data: unknown;
  cs: ChangeSet;
}
