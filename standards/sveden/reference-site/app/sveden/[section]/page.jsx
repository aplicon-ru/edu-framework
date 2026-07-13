import {
  loadVocab,
  listSectionKeys,
  getSection,
  sectionFields,
  sectionGroups,
} from "../../../lib/vocab.mjs";
import { loadSvedenData, sectionData } from "../../../lib/data.mjs";
import { renderText, hrefOf } from "../../../lib/render.mjs";

// Один шаблон обслуживает все 14 подразделов — состав полей/групп для каждого
// берётся из словаря (vocab/base.yaml), а не прописан здесь по одному на раздел.
export function generateStaticParams() {
  return listSectionKeys().map((section) => ({ section }));
}
export const dynamicParams = false;

// itemprop оборачивает ТОЛЬКО значение (_global.yaml, patterns.no_root) — подпись
// поля обязана быть снаружи, иначе она попадёт в значение микроразметки при
// чтении чекером (и тексту вроде "fullName:Значение" вместо "Значение").
function Field({ f, value }) {
  const href = hrefOf(value);
  const text = renderText(value);
  return (
    <div style={{ marginBottom: "0.4rem" }}>
      <span style={{ color: "#666", marginRight: "0.5rem" }}>{f.key}:</span>
      {href ? (
        <a itemprop={f.itemprop} href={href}>{text}</a>
      ) : (
        <span itemprop={f.itemprop}>{text}</span>
      )}
    </div>
  );
}

function GroupItem({ group, item }) {
  return (
    <div
      itemprop={group.itemprop}
      style={{ border: "1px solid #ddd", borderRadius: 6, padding: "0.75rem", marginBottom: "0.75rem" }}
    >
      {group.fields.map((f) => (
        <Field key={f.key} f={f} value={item?.[f.key]} />
      ))}
    </div>
  );
}

export default function SectionPage({ params }) {
  const { section: key } = params;
  const section = getSection(key);
  const fields = sectionFields(section);
  const groups = sectionGroups(section);
  const data = sectionData(loadSvedenData(), key);

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "2rem 1rem" }}>
      <p>
        <a href="/">← все подразделы</a>
      </p>
      <h1>{section.url}</h1>
      <p style={{ color: "#666" }}>
        Источник: {section.source}
        {section.a11y === "copy" && (
          <>
            {" · "}
            <a href="#copy">версия для слабовидящих</a>
          </>
        )}
      </p>

      {fields.length > 0 && (
        <section aria-label="Одиночные поля">
          {fields.map((f) => (
            <Field key={f.key} f={f} value={data.fields[f.key]} />
          ))}
        </section>
      )}

      {groups.map((g) => {
        const groupValue = data.groups[g.key];
        const items = Array.isArray(groupValue) ? groupValue : groupValue ? [groupValue] : [];
        return (
          <section key={g.key} aria-label={g.key} style={{ marginTop: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", color: "#444" }}>{g.key}</h2>
            {items.length === 0 ? (
              <p>отсутствует</p>
            ) : (
              items.map((item, i) => <GroupItem key={i} group={g} item={item} />)
            )}
          </section>
        );
      })}

      {section.a11y === "copy" && (
        <section id="copy" style={{ marginTop: "2rem", borderTop: "1px solid #ddd", paddingTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem" }}>Версия для слабовидящих</h2>
          <p style={{ color: "#888", fontSize: "0.85rem" }}>
            ⚠ Подписи полей ниже — технические ключи словаря, не человекочитаемые
            названия (словарь подписей ещё не согласован, см. README reference-site).
          </p>
          {fields.map((f) => (
            <p key={f.key}>
              {f.key}: {renderText(data.fields[f.key])}
            </p>
          ))}
        </section>
      )}
    </main>
  );
}
