export default function Footer() {
  return (
    <footer className="bg-dark py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-gray-500 text-sm">
        <p className="font-heading tracking-widest uppercase mb-4">&copy; {new Date().getFullYear()} KÜBRA SOYSAL. All rights reserved.</p>
        <p>Designed by <a href="https://instagram.com/Alperbykclk" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">@BuiltByAlper</a></p>
      </div>
    </footer>
  );
}
