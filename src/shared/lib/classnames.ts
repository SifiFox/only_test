import classNames, { type Argument } from "classnames";

export function cn(...inputs: Argument[]): string {
  return classNames(...inputs);
}
