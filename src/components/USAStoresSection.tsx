import React, { useState, useMemo } from 'react';
import {
  Store,
  MapPin,
  Search,
  CheckCircle2,
  Download,
  Copy,
  Clock,
  Phone,
  Layers,
  Globe,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import {
  ALL_USA_STORES,
  US_REGIONS,
  searchStores,
  exportStoresToCSV,
  USStoreLocation
} from '../utils/usStoresData';

export function USAStoresSection({
  selectedStoreNumber,
  onSelectStore
}: {
  selectedStoreNumber: string;
  onSelectStore: (store: USStoreLocation) => void;
}) {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedStateCode, setSelectedStateCode] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedStoreNum, setCopiedStoreNum] = useState<string | null>(null);

  // Group stores by state code
  const uniqueStates = useMemo(() => {
    const map = new Map<string, { code: string; name: string; region: string; count: number }>();
    for (const s of ALL_USA_STORES) {
      if (!map.has(s.state_code)) {
        map.set(s.state_code, { code: s.state_code, name: s.state, region: s.region, count: 1 });
      } else {
        map.get(s.state_code)!.count += 1;
      }
    }
    return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
  }, []);

  // Filtered store results
  const filteredStores = useMemo(() => {
    return searchStores(searchQuery, selectedRegion, selectedStateCode);
  }, [searchQuery, selectedRegion, selectedStateCode]);

  const activeStore = useMemo(() => {
    return ALL_USA_STORES.find(s => s.store_number === selectedStoreNumber) || ALL_USA_STORES[1]; // default TX
  }, [selectedStoreNumber]);

  const handleDownloadCSV = () => {
    const csv = exportStoresToCSV(filteredStores);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `walmart_usa_all_states_stores_${filteredStores.length}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const data = JSON.stringify(filteredStores, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `walmart_usa_all_states_stores_${filteredStores.length}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyConfigSnippet = (store: USStoreLocation) => {
    const snippet = `StoreConfig(store_number="${store.store_number}", zipcode="${store.zipcode}", name="${store.name}", address="${store.address}", state_code="${store.state_code}", city="${store.city}")`;
    navigator.clipboard.writeText(snippet);
    setCopiedStoreNum(store.store_number);
    setTimeout(() => setCopiedStoreNum(null), 2000);
  };

  return (
    <div className="max-w-[1410px] mx-auto p-4 md:p-6 space-y-6">
      {/* 1. Header & Summary Stats */}
      <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-4 md:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-sky-700 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                ALL 50 USA STATES + DC
              </span>
              <span className="bg-emerald-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Multi-Location Registry Active
              </span>
              <span className="bg-purple-100 text-purple-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-purple-300">
                Azure Batch & Container Jobs Ready
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-2 tracking-tight">
              Walmart USA Nationwide Store Directory & Dynamic Targeting
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-4xl leading-relaxed">
              Target any Walmart store across all 50 US States without code changes. Injects location-specific store cookies (<code className="font-mono text-sky-800">walmart.store.id</code>, <code className="font-mono text-sky-800">walmart.postalCode</code>) and validates curbside pickup fulfillment context before scraping.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center flex-wrap">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export Store CSV ({filteredStores.length})</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#107c41] hover:bg-[#0f6b38] text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Export Store JSON</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">USA State Coverage</div>
            <div className="text-xl font-black text-slate-900 mt-1">50 States + DC</div>
            <div className="text-[10.5px] text-emerald-700 font-semibold mt-0.5">100% Nationwide Assortment</div>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Target Location</div>
            <div className="text-xl font-black text-[#004f98] mt-1">#{activeStore.store_number}</div>
            <div className="text-[10.5px] text-slate-600 truncate mt-0.5">{activeStore.city}, {activeStore.state_code} ({activeStore.zipcode})</div>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fulfillment Context</div>
            <div className="text-xl font-black text-emerald-600 mt-1">Curbside Pickup</div>
            <div className="text-[10.5px] text-slate-600 mt-0.5">Aisle-specific local pricing</div>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Multi-Store Execution</div>
            <div className="text-xl font-black text-purple-700 mt-1">Azure Ready</div>
            <div className="text-[10.5px] text-slate-600 mt-0.5">config.py dynamic targeting</div>
          </div>
        </div>
      </div>

      {/* 2. State & Region Interactive Filter Grid */}
      <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-4 md:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Browse Stores by USA State (Click to Target Location)
            </h2>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 text-xs flex-wrap">
            {US_REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setSelectedRegion(r);
                  setSelectedStateCode('All');
                }}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors ${
                  selectedRegion === r ? 'bg-white shadow-xs text-sky-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'All' ? 'All Regions (51)' : r}
              </button>
            ))}
          </div>
        </div>

        {/* State Quick-Chips Grid */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            onClick={() => setSelectedStateCode('All')}
            className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
              selectedStateCode === 'All'
                ? 'bg-[#004f98] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All States ({ALL_USA_STORES.length})
          </button>

          {uniqueStates
            .filter((st) => selectedRegion === 'All' || st.region === selectedRegion)
            .map((st) => (
              <button
                key={st.code}
                onClick={() => setSelectedStateCode(st.code)}
                className={`px-2 py-1 rounded text-xs font-mono font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                  selectedStateCode === st.code
                    ? 'bg-[#0071dc] text-white font-bold shadow-xs'
                    : 'bg-slate-50 hover:bg-sky-50 text-slate-800 border border-slate-200'
                }`}
                title={`${st.name} (${st.count} stores)`}
              >
                <span>{st.code}</span>
                <span className="text-[9px] opacity-75">({st.count})</span>
              </button>
            ))}
        </div>
      </div>

      {/* 3. Search & Store Directory List */}
      <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-4 md:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by state, city, ZIP (e.g. '75001', 'Chicago', 'CA', 'Dallas')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{filteredStores.length}</strong> of {ALL_USA_STORES.length} USA Locations
          </div>
        </div>

        {/* Store Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredStores.map((store) => {
            const isCurrent = store.store_number === activeStore.store_number;

            return (
              <div
                key={store.store_number}
                className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-sky-50/70 border-sky-500 ring-2 ring-sky-400/40 shadow-xs'
                    : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-sky-800 bg-sky-100 px-1.5 py-0.2 rounded">
                          #{store.store_number}
                        </span>
                        <span className="bg-slate-200 text-slate-800 font-bold text-[10px] px-1.5 py-0.2 rounded">
                          {store.state_code}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {store.region}
                        </span>
                      </div>
                      <h3 className="font-bold text-xs text-slate-900 mt-1 leading-snug">
                        {store.name}
                      </h3>
                    </div>

                    {isCurrent && (
                      <span className="bg-emerald-600 text-white font-bold text-[9.5px] px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        <Check className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>

                  {/* Address & Details */}
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{store.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[11px]">{store.hours} ({store.timezone})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[11px] font-mono">{store.phone}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 text-[10px] pt-1">
                    <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                      Curbside Pickup
                    </span>
                    <span className="bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-semibold">
                      In-Store Aisle Pricing
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3.5 pt-2.5 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectStore(store)}
                    className={`flex-1 py-1.5 px-2.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[#0071dc] hover:bg-[#005bb5] text-white shadow-2xs'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    <span>{isCurrent ? 'Targeted Location' : 'Target This Store'}</span>
                  </button>

                  <button
                    onClick={() => copyConfigSnippet(store)}
                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs cursor-pointer"
                    title="Copy Python StoreConfig line"
                  >
                    {copiedStoreNum === store.store_number ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
