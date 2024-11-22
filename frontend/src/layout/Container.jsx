export default function Container({ children, hasMenu }) {
  return (
    <div
      className={`min-h-screen p-6 bg-gray-700 text-gray-100 ${
        hasMenu ? "w-5/6 ml-[16.6667%]" : "w-full ml-0"
      }`}
    >
      {children}
    </div>
  );
}
