"use client";
import { useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [tourName, setTourName] = useState("");
  const [price, setPrice] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [people, setPeople] = useState("1");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === "") {
      setAuthError("Enter the password");
      return;
    }
    setAuthenticated(true);
    setAuthError("");
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPaymentLink("");
    setCopied(false);

    try {
      const res = await fetch("/api/admin/custom-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminPassword: password,
          tourName,
          price,
          customerName,
          customerEmail,
          tourDate,
          people,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setAuthenticated(false);
          setAuthError("Incorrect password");
        } else {
          setError(data.error || "Error generating link");
        }
        return;
      }

      setPaymentLink(data.url);
    } catch {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const total = parseFloat(price) * parseInt(people);
    const msg = encodeURIComponent(
      `Hi ${customerName}! 👋\n\nHere is your payment link for *${tourName}*:\n📅 Date: ${tourDate}\n👥 People: ${people}\n💰 Total: $${total.toFixed(2)} USD\n\n🔗 ${paymentLink}\n\nThank you for choosing Fantasy Travels! 🌴`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const handleReset = () => {
    setTourName("");
    setPrice("");
    setCustomerName("");
    setCustomerEmail("");
    setTourDate("");
    setPeople("1");
    setNotes("");
    setPaymentLink("");
    setError("");
    setCopied(false);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">F</div>
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-gray-500 text-sm mt-1">Fantasy Travels</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
            />
            {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
            <button
              type="submit"
              className="bg-primary text-white py-3 rounded-2xl font-medium hover:bg-primary-dark transition-all"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Custom Payment Link</h1>
            <p className="text-gray-500 text-sm">Generate a Stripe payment link for any client</p>
          </div>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">F</div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tour / Service name *</label>
              <input
                type="text"
                placeholder="e.g. Private Catamaran – 6 people"
                value={tourName}
                onChange={(e) => setTourName(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Price per person (USD) *</label>
                <input
                  type="number"
                  placeholder="119"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="1"
                  step="0.01"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">People *</label>
                <input
                  type="number"
                  placeholder="2"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  required
                  min="1"
                  max="50"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {price && people && (
              <div className="bg-primary/5 rounded-2xl px-4 py-3 text-sm">
                <span className="text-gray-600">Total: </span>
                <span className="font-bold text-primary text-lg">
                  ${(parseFloat(price || "0") * parseInt(people || "1")).toFixed(2)} USD
                </span>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Client name *</label>
              <input
                type="text"
                placeholder="John Smith"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Client email (optional)</label>
              <input
                type="email"
                placeholder="client@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tour date *</label>
              <input
                type="date"
                value={tourDate}
                onChange={(e) => setTourDate(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Notes (optional)</label>
              <textarea
                placeholder="Special requests, pickup location, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm rounded-2xl px-4 py-3">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white py-3 rounded-2xl font-medium hover:bg-primary-dark transition-all disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate payment link"}
            </button>
          </form>
        </div>

        {paymentLink && (
          <div className="bg-white rounded-3xl shadow-sm border border-green-100 p-6 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-500 text-xl">✅</span>
              <h2 className="font-semibold text-gray-800">Payment link ready!</h2>
            </div>

            <div className="bg-gray-50 rounded-2xl px-4 py-3 text-xs text-gray-600 break-all mb-4 font-mono">
              {paymentLink}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleCopy}
                className="w-full border border-gray-200 hover:border-primary text-gray-700 hover:text-primary py-3 rounded-2xl text-sm font-medium transition-all"
              >
                {copied ? "✅ Copied!" : "📋 Copy link"}
              </button>
              <button
                onClick={handleWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl text-sm font-medium transition-all"
              >
                💬 Send via WhatsApp
              </button>
              <button
                onClick={handleReset}
                className="w-full text-gray-400 hover:text-gray-600 py-2 text-sm transition-all"
              >
                Generate another link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
