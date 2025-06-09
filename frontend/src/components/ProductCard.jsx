export default function ProductCard({ image, title, gender, price }) {
    return (
        <div className="bg-white overflow-hidden w-32 md:w-64">
            {/* Product Image */}
            <img
                src={image}
                alt={title}
                className="w-full h-32 md:h-64 object-cover p-2"
            />

            {/* Product Info */}
            <div className="p-2 flex flex-col">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm md:text-lg font-semibold text-gray-900">{title}</h3>
                    
                    <span className="text-lg md:text-xl font-bold text-gray-800">₹{price}</span>
                </div>
                <div className="flex flex-col justify-center items-start">
                    <span className="text-xs md:text-sm text-gray-500 uppercase">{gender}</span>
                    <button className="px-2 md:px-4 py-1 md:py-2 mt-1 text-xs md:text-sm bg-white text-black border w-full hover:bg-black hover:text-white transition">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
