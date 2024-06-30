const StatCard = ({ title, value, icon, bgColor, textColor }) => {
  return (
    <div
      className={`py-4 px-8 h-32 gap-6 rounded-xl shadow-lg flex flex-col justify-between relative text-white font-extrabold`}
      style={{ background: bgColor }}
    >
      <img
        src={icon}
        alt="icon"
        className="w-[6rem] h-[6rem] absolute bottom-2 left-2 transform -rotate-12"
      />
      <div className="flex flex-col justify-between text-right h-full">
        <p className="text-xl text-center ml-4">{title}</p>
        <p className="text-3xl">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
