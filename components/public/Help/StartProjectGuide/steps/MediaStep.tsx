import { IconCamera, IconPalette, IconSparkles, IconLink, IconVideo } from '../icons';

export default function MediaStep() {
  return (
    <div className="space-y-6">
      <div className="browser-window bg-yellow-50 border-2 border-black">
        <div className="p-6">
          <h3 className="hand-drawn text-xl font-bold text-black mb-4">
            Project Image
          </h3>
          <p className="text-base font-semibold text-gray-800 mb-4">
            A great image is worth a thousand words! Your project image is the first visual impression:
          </p>
          <ul className="space-y-3 text-base font-semibold text-gray-800">
            <li className="flex items-start gap-3">
              <IconCamera className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span><strong>High Quality:</strong> Use at least 1200x675 pixels for best results</span>
            </li>
            <li className="flex items-start gap-3">
              <IconPalette className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span><strong>Clear & Compelling:</strong> Show your product, prototype, or concept clearly</span>
            </li>
            <li className="flex items-start gap-3">
              <IconSparkles className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span><strong>Professional:</strong> Good lighting, proper framing, and clean background</span>
            </li>
            <li className="flex items-start gap-3">
              <IconLink className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span><strong>Hosted URL:</strong> Provide a direct link to your image (e.g., from Imgur, Cloudinary, or your own server)</span>
            </li>
          </ul>
          <div className="mt-4 bg-white border-4 border-black p-4">
            <p className="text-sm font-semibold text-gray-800">
              <strong>Pro Tip:</strong> Projects with high-quality images get 2.5x more views and 3x more funding!
            </p>
          </div>
        </div>
      </div>

      <div className="browser-window bg-white border-2 border-black">
        <div className="p-6">
          <h3 className="hand-drawn text-xl font-bold text-black mb-4">
            Video URL
          </h3>
          <p className="text-base font-semibold text-gray-800 mb-4">
            Videos are incredibly powerful for fundraising. They help backers connect with your project:
          </p>
          <ul className="space-y-3 text-base font-semibold text-gray-800">
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">1</span>
              </span>
              <span><strong>Platform Support:</strong> YouTube, Vimeo, or any video hosting service</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">2</span>
              </span>
              <span><strong>Length:</strong> 2-3 minutes is ideal. Keep it engaging!</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">3</span>
              </span>
              <span><strong>Content:</strong> Introduce yourself, explain the problem, show your solution, and make the ask</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">4</span>
              </span>
              <span><strong>Quality:</strong> Good audio is more important than perfect video quality</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-100 border-4 border-black p-6">
        <div className="flex items-start gap-4">
          <IconVideo className="w-8 h-8 text-black flex-shrink-0 mt-1" />
          <div>
            <h4 className="hand-drawn text-lg font-bold text-black mb-2">
              Video Best Practices
            </h4>
            <ul className="space-y-2 text-base font-semibold text-gray-800">
              <li>• Start with a hook - grab attention in the first 10 seconds</li>
              <li>• Show, don't just tell - demonstrate your product or concept</li>
              <li>• Be authentic - let your passion shine through</li>
              <li>• Include a clear call-to-action at the end</li>
              <li>• Add captions for accessibility</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="browser-window bg-white border-2 border-black">
        <div className="p-6">
          <h3 className="hand-drawn text-xl font-bold text-black mb-4">
            Media Checklist
          </h3>
          <div className="space-y-2">
            {[
              'Image is high resolution (1200x675 or larger)',
              'Image clearly shows your project/product',
              'Video is uploaded to YouTube or Vimeo',
              'Video is 2-3 minutes long',
              'Video has good audio quality',
              'All URLs are accessible and working',
            ].map((item, index) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 border-4 border-black accent-yellow-400"
                  readOnly
                />
                <span className="text-base font-semibold text-gray-800">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

