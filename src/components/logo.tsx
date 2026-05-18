import Image from "next/image";
import logo from "../../public/logo.png";

export default function Logo({
  width = 250,
  height,
  ...props
}: {
  width?: number;
  height?: number;
}) {
  return (
    <a href="/." {...props}>
      <Image
        className="w-full overflow-hidden"
        width={width}
        height={height}
        src={logo}
        alt="Logo Quatro ponto zero"
      />
    </a>
  );
}
