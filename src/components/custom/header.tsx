const links = [
  {
    name: "Generate certificate",
    path: "/certificate/generate",
  },
  {
    name: "Send Certificate",
    path: "/certificate/send",
  },
];
export function Header() {
  return (
    <div>
      <nav className="fixed w-full bg-gray-800 text-white py-4 px-10 flex justify-center gap-10  items-center">
        <div className="min-w-[40%]">
          <p>Certificate Generator</p>
        </div>
        {links.map((link) => (
          <div key={link.path}>
            <a href={link.path}>{link.name}</a>
          </div>
        ))}
      </nav>
    </div>
  );
}
