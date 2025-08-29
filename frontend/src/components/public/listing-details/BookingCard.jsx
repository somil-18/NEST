import { colors } from "@/utils/colors";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// Booking Card Component
const BookingCard = ({ room }) => {
  const [guests, setGuests] = useState(1);

  // SCROLL TO TOP
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Card className="sticky top-20">
      <CardContent className="p-6">
        <div className="flex items-baseline gap-2 mb-6">
          <span
            className="text-3xl font-bold"
            style={{ color: colors.primary }}
          >
            ₹{room.price.toLocaleString()}
          </span>
          <span className="text-gray-500">/month</span>
          {room.originalPrice && (
            <span className="text-lg text-gray-400 line-through ml-2">
              ₹{room.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Guests</label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full p-2 border rounded-lg"
            >
              {Array.from({ length: room.capacity.guests }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} guest{i > 0 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          className="w-full py-3 text-lg font-semibold"
          style={{ backgroundColor: colors.primary }}
          disabled={guests < 1}
        >
          Reserve
        </Button>

        <p className="text-center text-sm text-gray-500 mt-3">
          You won't be charged yet
        </p>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
