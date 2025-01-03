import CloseIcon from "@mui/icons-material/Close";

export default function Modal({ onConfirm, onClose, children }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-45"></div>
      <div className="relative bg-gray-800 rounded-lg p-6 shadow-lg z-10 w-[90%] sm:w-[400px]">
        <button
          className="absolute right-6 top-6 hover:bg-gray-700 focus:outline-none w-7 h-7 flex items-center justify-center rounded-lg"
          onClick={onClose}
        >
          <CloseIcon
            style={{
              width: "16px",
              height: "16px",
              color: "white",
            }}
          />
        </button>
        <div className="mb-1">{children}</div>
      </div>
    </div>
  );
}
