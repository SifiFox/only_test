import { createElement } from "react";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";

type TypographyTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

type TypographyProps<TTag extends TypographyTag> = ComponentPropsWithoutRef<TTag> & {
  children?: ReactNode;
};

type TypographyTagComponent<TTag extends TypographyTag> = (
  props: TypographyProps<TTag>
) => ReactElement;

interface TypographyCompound {
  h1: TypographyTagComponent<"h1">;
  h2: TypographyTagComponent<"h2">;
  h3: TypographyTagComponent<"h3">;
  h4: TypographyTagComponent<"h4">;
  h5: TypographyTagComponent<"h5">;
  h6: TypographyTagComponent<"h6">;
  p: TypographyTagComponent<"p">;
  span: TypographyTagComponent<"span">;
  div: TypographyTagComponent<"div">;
}

function createTypographyTag<TTag extends TypographyTag>(tag: TTag): TypographyTagComponent<TTag> {
  return function TypographyTag({ children, ...props }: TypographyProps<TTag>) {
    return createElement(tag, props, children);
  };
}

export const Typography: TypographyCompound = {
  h1: createTypographyTag("h1"),
  h2: createTypographyTag("h2"),
  h3: createTypographyTag("h3"),
  h4: createTypographyTag("h4"),
  h5: createTypographyTag("h5"),
  h6: createTypographyTag("h6"),
  p: createTypographyTag("p"),
  span: createTypographyTag("span"),
  div: createTypographyTag("div")
};