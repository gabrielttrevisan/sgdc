function e(e) {
  return (
    (e &&
      (function (e) {
        if (!e) return !1;
        const t = e.split(" ");
        return t.length >= 2;
      })(e) &&
      (function (e) {
        let t = !0;
        if (!e) return !1;
        const r = e.split(" ");
        for (let o = 0; o < 2; o++) r[o].length < 2 && (t = !1);
        return t;
      })(e)) ||
    "Por favor, insira seu nome completo"
  );
}
function t(e, { fields: t, onSubmit: r, validationTimeout: o = 500 }) {
  const n = Object.entries(t).reduce((e, [t, r]) => {
      const o = r.required ?? !0,
        n = !o;
      return {
        ...e,
        [t]: { ...r, touched: !1, valid: n, error: null, required: o },
      };
    }, {}),
    i = e.querySelectorAll("input");
  if (!i) throw new Error("Form has no input or valid fields");
  const a = e.querySelector('button[type="submit"]');
  if (!a) throw new Error("Form has no valid submit button");
  let s;
  const l = async () => {
      (clearTimeout(s),
        (s = setTimeout(() => {
          Object.entries(n).every(
            ([e, t]) => (!1 === t.required && !1 === t.touched) || t.valid,
          ) && (a.disabled = !1);
        }, o)));
    },
    d = (e, t) => {
      if (!n[e]) return;
      const r = n[e];
      ((r.valid = !1),
        (r.touched = !0),
        (r.error = t),
        r.errorElement?.classList?.add("--visible"),
        r.errorElement?.replaceChildren(t),
        r.element?.setAttribute("aria-invalid", "true"),
        r.group?.setAttribute("data-invalid", "true"),
        (a.disabled = !0));
    },
    u = (e) => {
      if (!n[e]) return;
      const t = n[e];
      ((t.valid = !0),
        (t.touched = !0),
        (t.error = null),
        t.errorElement?.classList?.remove("--visible"),
        t.errorElement?.replaceChildren(""),
        t.element?.removeAttribute("aria-invalid"),
        t.group?.removeAttribute("data-invalid"));
    },
    c = () => {
      for (const e in n) {
        const t = n[e];
        if (
          (u(e), (t.touched = !1), (t.valid = !1), (t.error = null), t.element)
        ) {
          const e = t.element;
          ((e.value = ""), e.controller?.reset());
          const r = e.closest(".m-input-group");
          r && r.classList.remove("--filled");
        }
      }
      a.disabled = !0;
    };
  for (const m of i) {
    const t = m.name,
      r = e.querySelector(`.m-input-group__error[data-for="${t}"]`);
    let o = n[t];
    const i = m.closest(".m-input-group");
    (o
      ? (r && (o.errorElement = r), (o.element = m), (o.group = i))
      : (o = n[t] =
          {
            touched: !1,
            valid: !1,
            error: null,
            errorElement: r || null,
            element: m,
            validate: () => !0,
            group: i,
          }),
      m.addEventListener("input", () => {
        ((o.touched = !0),
          o.mask && (m.value = o.mask(m.value)),
          0 === m.value.trim().length
            ? o.group?.classList?.remove("--filled")
            : o.group?.classList?.add("--filled"));
        const e = o.validate(m.value);
        (!0 === e ? u(t) : d(t, e), l());
      }));
  }
  return (
    e.addEventListener("submit", async (o) => {
      if ((o.preventDefault(), o.stopPropagation(), e.checkValidity())) {
        const t = new FormData(e);
        a.classList.add("--loading");
        const n = a.textContent;
        ((a.disabled = !0),
          await r({ form: e, button: a, data: t, reset: c }, o),
          a.classList.remove("--loading"),
          (a.textContent = n),
          (a.disabled = !1));
      } else {
        a.disabled = !0;
        for (const e of i) {
          const r = e.name,
            o = t[r]?.validate,
            n = o?.(e.value);
          !0 !== n ? d(r, n) : u(r);
        }
      }
    }),
    { reset: c, form: e, button: a }
  );
}
function r(e) {
  const t = e.replace(/\D/g, "");
  return (
    (11 === t.length
      ? /^(\d{2})(\d{5})(\d{4})$/
      : /^(\d{2})(\d{4})(\d{4})$/
    ).test(t) || "Por favor, inserir um número de telefone válido"
  );
}
function o(e) {
  if (!e) return "O e-mail é obrigatório.";
  const t = e.toLowerCase().split("@");
  if (2 !== t.length) return 'O e-mail deve conter exatamente um "@"';
  const [r, o] = t;
  if (!r) return 'A parte antes do "@" não pode estar vazia';
  const n = r.match(/[^a-z0-9_.-]/g);
  if (n) {
    return `Caracteres não permitidos: ${Array.from(new Set(n)).join(", ")}`;
  }
  if (r.startsWith(".") || r.endsWith("."))
    return 'O ponto não pode ser o primeiro ou último caractere antes do "@"';
  if (r.includes(".."))
    return 'Não são permitidos pontos consecutivos antes do "@"';
  if (!o) return 'A parte depois do "@" não pode estar vazia';
  return (
    !!/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(o) || "O domínio do e-mail é inválido"
  );
}
function n(e) {
  const t = e.replace(/\D/g, "");
  return 11 === t.length
    ? t.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
    : t.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
}
export { r as a, e as b, t as f, n as m, o as v };
