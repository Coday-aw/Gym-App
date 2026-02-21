import Link from "next/link";
import { pageLinks } from "../lib/data";

const Header = () => {
  return (
    <nav>
      <ul className="flex flex-row justify-between bg-neutral-900 rounded-2xl p-2">
        {pageLinks.map((link, index) => (
          <li key={index}>
            <Link href={link.href} className="flex flex-col justify-center items-center py-1 px-5 rounded-2xl focus:bg-blue-900">
              <span className="text-md">{link.icon}</span>
              <h1 className="font-bold text-md">{link.title}</h1>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Header;
