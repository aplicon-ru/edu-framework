export const metadata = {
  title: "Сведения об образовательной организации",
  description: "Эталонный рендер раздела /sveden/ по Приказу Рособрнадзора № 1493",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
