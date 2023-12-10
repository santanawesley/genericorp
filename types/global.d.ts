import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      a: React.DetailedHTMLProps<React.HTMLAttributes<HTMLAElement>, HTMLAElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPElement>, HTMLPElement>;
      input: React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>, HTMLInputElement>;
      button: React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      img: React.DetailedHTMLProps<React.HTMLAttributes<HTMLImgElement>, HTMLImgElement>;
      label: React.DetailedHTMLProps<React.HTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
      h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLH1Element>, HTMLH1Element>;
    }
  }
}
