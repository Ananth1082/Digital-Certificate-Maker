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
      <nav>
        <ul className="bg-gray-800 text-white py-4 px-10 flex justify-center gap-10  items-center">
          <li className="min-w-[40%]"></li>
          {links.map((link) => (
            <li key={link.path}>
              <a href={link.path}>{link.name}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
