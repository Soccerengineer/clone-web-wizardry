
import { Star } from "lucide-react";

const UserProfile = () => {
  return (
    <div className="flex items-center gap-4">
      <img
        src="/lovable-uploads/31dd6418-1a95-4b8e-8af1-81058a36855d.png"
        alt="User Avatar"
        className="w-24 h-24 rounded-full border-4 border-primary"
      />
      <div>
        <h1 className="text-2xl font-bold text-white">Süper Oyuncu</h1>
        <div className="text-lg text-gray-300">Ali Nazik</div>
        <div className="flex items-center gap-1 text-primary mt-1">
          <span>3.7</span>
          <div className="flex">
            {[1, 2, 3].map((i) => (
              <Star key={i} className="w-4 h-4 fill-primary" />
            ))}
            <Star className="w-4 h-4 fill-primary/50" />
            <Star className="w-4 h-4 fill-transparent stroke-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
