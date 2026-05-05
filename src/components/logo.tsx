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
        width={width}
        height={height}
        src={logo}
        alt="Logo Quatro ponto zero"
      />
    </a>
  );
}
