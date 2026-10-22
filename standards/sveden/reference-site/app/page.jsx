import { loadVocab, listSectionKeys } from "../lib/vocab.mjs";

export default function IndexPage() {
  const vocab = loadVocab();
  const keys = listSectionKeys();

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>Сведения об образовательной организации</h1>
      <p>
        Эталонный рендер 14 подразделов (Табл. 3.1 Метод. рекомендаций Рособрнадзора v9.0.0),
        сгенерированный из <code>standards/sveden/vocab/base.yaml</code> и файла данных.
      </p>
      <ul>
        {keys.map((key) => (
          <li key={key}>
            <a href={`${vocab[key].url}/`}>{vocab[key].url}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
