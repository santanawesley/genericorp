import React from "react";

export const masks = {
  name(value: string) {
    return value.replace(/\[^\w\.]|\d/g, "");
  },

  currencyFormatter(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  },

  phone(phone: string): string {
    let r = phone.replace(/\D/g, "");
    r = r.replace(/^0/, "");
    if (r.length > 10) {
      r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (r.length > 6) {
      r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (r.length > 2) {
      r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
    } else if (r.length > 0) {
      r = r.replace(/^(\d*)/, "($1");
    }
    return r;
  },
};
