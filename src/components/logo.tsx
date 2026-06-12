import Image from "next/image";
import logo from "../../public/logo.png";
import logo_icon from "../../public/logo_icon.png";
import Link from "next/link";

export default function Logo({
  icon = false,
  width = 250,
  height,
  ...props
}: {
  icon?: boolean;
  width?: number;
  height?: number;
}) {
  return (
    <Link href="/" {...props}>
      <Image
        className="w-full overflow-hidden"
        width={width}
        height={height}
        src={icon ? logo_icon : logo}
        alt="Logo Quatro ponto zero"
      />
    </Link>
  );
}
