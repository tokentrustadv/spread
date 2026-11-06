export function DeliveryMockup() {
  return (
    <div className="card mt-6 overflow-hidden p-0">
      <div className="border-b border-line bg-bg px-4 py-2 text-center text-xs font-semibold text-soft">
        It&rsquo;s a conversation, not a dispatch
      </div>
      <div className="flex flex-col gap-2 p-5">
        <div className="max-w-[80%] self-start rounded-input rounded-bl-none bg-bg px-3 py-2 text-sm">
          Can I grab The Orange Chicken Drop? 214 Birch Ave, Apt 3 — I&rsquo;ll
          be home after 5.
        </div>
        <div className="max-w-[80%] self-end rounded-input rounded-br-none bg-node px-3 py-2 text-sm text-white">
          Got you — $18, I&rsquo;ll drop it off around 6.
        </div>
        <div className="max-w-[80%] self-start rounded-input rounded-bl-none bg-bg px-3 py-2 text-sm">
          Perfect, thank you!
        </div>
      </div>
    </div>
  );
}
