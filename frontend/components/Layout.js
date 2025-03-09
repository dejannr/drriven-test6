export default function Layout({ children }) {
  return (
    <div>
      <header>
        <h1>My App</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
