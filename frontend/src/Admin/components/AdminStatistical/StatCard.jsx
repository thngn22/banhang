const StatCard = ({ title, value, icon, bgColor, textColor }) => {
  return (
    <div
      className={`p-8 rounded-xl shadow-lg flex flex-col justify-between relative text-white font-bold`}
      style={{ background: bgColor }}
    >
      <img
        src={icon}
        alt="icon"
        className="w-[6rem] h-[6rem] absolute bottom-2 left-2 transform -rotate-12"
      />
      <div className="text-right">
        <h3 className="text-2xl">{title}</h3>
        <p className="text-2xl">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
