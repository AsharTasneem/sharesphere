import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          How ShareSphere Works
        </h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">For Borrowers</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                ShareSphere makes it easy to borrow items from people in your
                community.
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Browse available items in your area</li>
                <li>Send a borrow request with your desired dates</li>
                <li>Chat with the owner to arrange pickup</li>
                <li>Pay securely through the platform</li>
                <li>Pick up the item and enjoy!</li>
                <li>Return the item on time</li>
                <li>Leave a review to help others</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">For Lenders</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Turn your unused items into income by sharing them with your
                community.
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Create a listing with photos and details</li>
                <li>Set your price per day and deposit amount</li>
                <li>Receive borrow requests from interested users</li>
                <li>Accept or decline requests</li>
                <li>Chat with borrowers to coordinate pickup</li>
                <li>Get paid automatically when the rental starts</li>
                <li>Receive your deposit back when items are returned</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Safety & Trust</h2>
            <div className="space-y-4 text-gray-700">
              <p>We take safety and trust seriously:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Identity verification for all users</li>
                <li>Secure payment processing</li>
                <li>Deposit protection for lenders</li>
                <li>Review and rating system</li>
                <li>24/7 customer support</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link to="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
