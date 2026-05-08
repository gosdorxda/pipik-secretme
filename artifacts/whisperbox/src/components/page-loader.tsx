function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="flex gap-[7px] items-center">
        <span
          className="size-2 rounded-full bg-[#0f9e80] animate-[dot-bounce_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="size-2 rounded-full bg-[#0f9e80] animate-[dot-bounce_1.2s_ease-in-out_infinite] opacity-60"
          style={{ animationDelay: "0.2s" }}
        />
        <span
          className="size-2 rounded-full bg-[#0f9e80] animate-[dot-bounce_1.2s_ease-in-out_infinite] opacity-30"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    </div>
  );
}

export { PageLoader };
