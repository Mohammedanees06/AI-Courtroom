export default function BurdenMeter({ sideAWeight, sideBWeight }) {
  return (
    <div className="mt-3 text-center text-sm text-gray-500">
      Burden Balance: A {sideAWeight ?? 0} | B {sideBWeight ?? 0}
    </div>
  );
}
