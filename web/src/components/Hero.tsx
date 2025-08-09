const Hero = () => {
  return (
    <div className="flex flex-col items-center mt-8 sm:mt-12">
      <p className="text-center mt-1 font-jetbrains-mono text-gray-500">
        npx coolbg
      </p>

      <h1 className="text-4xl sm:text-6xl font-bold font-montserrat text-center">
        <span>Cool </span>
        <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
          Background
        </span>
      </h1>
      <p className="text-base sm:text-lg text-center mt-2 font-nunito px-2">
        Create cool backgrounds for your images with ease.
      </p>
    </div>
  );
};

export default Hero;
