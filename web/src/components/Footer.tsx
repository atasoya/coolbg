const Footer = () => {
  return (
    <footer className="w-full flex items-center justify-center py-8">
      <div className="text-sm text-gray-500 flex items-center gap-4">
        <a
          href="https://github.com/atasoya/coolbg"
          target="_blank"
          rel="noreferrer noopener"
          className="hover:text-gray-700 underline-offset-4 hover:underline"
        >
          GitHub Repo
        </a>
        <span className="text-gray-300">•</span>
        <a
          href="https://ata.soy"
          target="_blank"
          rel="noreferrer noopener"
          className="hover:text-gray-700 underline-offset-4 hover:underline"
        >
          ata.soy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
