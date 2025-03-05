export default function Container({ children, hasMenu }) {
  return (
    <div
      className={`min-h-screen p-6 bg-gray-700 text-gray-100 transition-all ${
        hasMenu ? "lg:w-5/6 lg:ml-[16.6667%] w-full ml-0" : "w-full ml-0"
      }`}
    >
      {children}
    </div>
  );
}
