import Image from "next/image";

interface CardProps {
  title: string;
  publishing_year: string;
  poster_url: string;
  poster_alt: string;
}

export default function Card({
  title,
  publishing_year,
  poster_url,
  poster_alt,
}: CardProps) {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden bg-green-dark shadow-lg">
      <Image
        src={`https://movies-next-demo.s3.eu-west-1.amazonaws.com/${poster_url}`}
        className="w-full"
        alt={poster_alt}
        width={400}
        height={300}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-white text-xl mb-2">{title}</div>
        <p className="text-white text-base">{publishing_year}</p>
      </div>
    </div>
  );
}
