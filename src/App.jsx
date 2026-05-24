import { useState, useRef } from "react";

const ACCENT = "#C8A96E";
const BG = "#0F0E0C";
const CARD_BG = "#1A1814";
const BORDER = "#2E2B24";
const TEXT = "#EDE8DF";
const MUTED = "#7A7469";

const initialItems = [];

function StatusBadge({ status }) {
  const map = {
    "待购买": { bg: "#2A1F0A", color: "#C8A96E", dot: "#C8A96E" },
    "高优先级": { bg: "#2A0A0A", color: "#E07070", dot: "#E07070" },
    "考虑中": { bg: "#0A1A2A", color: "#6EA8C8", dot: "#6EA8C8" },
    "已购买": { bg: "#0A2A12", color: "#6EC87A", dot: "#6EC87A" },
  };
  const s = map[status] || map["考虑中"];
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.color}40`,
      borderRadius: 4, padding: "2px 10px", fontSize: 11, fontWeight: 600,
      letterSpacing: 1, display: "inline-flex", alignItems: "center", gap: 5
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

function PriorityIcon({ priority }) {
  const stars = { "高": 3, "中": 2, "低": 1 }[priority] || 1;
  return (
    <span style={{ color: ACCENT, fontSize: 12 }}>
      {"★".repeat(stars)}{"☆".repeat(3 - stars)}
    </span>
  );
}

function ItemCard({ item, onDelete, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item);

  const handleSave = () => {
    onUpdate(draft);
    setEditing(false);
  };

  return (
    <div style={{
      background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12,
      overflow: "hidden", transition: "box-shadow 0.2s",
      boxShadow: expanded ? `0 0 0 1px ${ACCENT}40, 0 8px 32px #00000060` : "0 2px 12px #00000040"
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
        onClick={() => setExpanded(e => !e)}>
        {item.image && (
          <img src={item.image} alt="" style={{
            width: 56, height: 56, objectFit: "cover", borderRadius: 8,
            border: `1px solid ${BORDER}`, flexShrink: 0
          }} />
        )}
        {!item.image && (
          <div style={{
            width: 56, height: 56, borderRadius: 8, background: "#252219",
            border: `1px solid ${BORDER}`, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 24, flexShrink: 0
          }}>🛋️</div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ color: TEXT, fontWeight: 700, fontSize: 15, fontFamily: "'Playfair Display', serif" }}>
              {item.name}
            </span>
            <StatusBadge status={item.status} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 4, alignItems: "center", flexWrap: "wrap" }}>
            <PriorityIcon priority={item.priority} />
            {item.estimatedPrice && (
              <span style={{ color: ACCENT, fontSize: 12, fontWeight: 600 }}>¥{item.estimatedPrice}</span>
            )}
            {item.category && (
              <span style={{ color: MUTED, fontSize: 11 }}>{item.category}</span>
            )}
          </div>
        </div>
        <span style={{ color: MUTED, fontSize: 12, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}>▼</span>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "16px 20px" }}>
          {!editing ? (
            <>
              <div style={{ display: "grid", gap: 12 }}>
                {item.reason && (
                  <div>
                    <div style={{ color: MUTED, fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>购买理由</div>
                    <div style={{ color: TEXT, fontSize: 13, lineHeight: 1.6 }}>{item.reason}</div>
                  </div>
                )}
                {item.alternative && (
                  <div>
                    <div style={{ color: MUTED, fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>现有替代品</div>
                    <div style={{ color: "#A09585", fontSize: 13, lineHeight: 1.6, fontStyle: "italic" }}>{item.alternative}</div>
                  </div>
                )}
                {item.notes && (
                  <div>
                    <div style={{ color: MUTED, fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>备注</div>
                    <div style={{ color: TEXT, fontSize: 13, lineHeight: 1.6 }}>{item.notes}</div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button onClick={() => setEditing(true)} style={{
                  background: "transparent", border: `1px solid ${BORDER}`, color: TEXT,
                  borderRadius: 6, padding: "6px 16px", cursor: "pointer", fontSize: 12
                }}>编辑</button>
                <button onClick={() => onDelete(item.id)} style={{
                  background: "transparent", border: "1px solid #3A1A1A", color: "#E07070",
                  borderRadius: 6, padding: "6px 16px", cursor: "pointer", fontSize: 12
                }}>删除</button>
              </div>
            </>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {[
                ["name", "家具名称", "text"],
                ["category", "分类", "text"],
                ["estimatedPrice", "预算价格", "number"],
                ["reason", "购买理由", "textarea"],
                ["alternative", "现有替代品", "textarea"],
                ["notes", "备注", "textarea"],
              ].map(([key, label, type]) => (
                <div key={key}>
                  <div style={{ color: MUTED, fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>{label}</div>
                  {type === "textarea" ? (
                    <textarea value={draft[key] || ""} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
                      style={{
                        width: "100%", background: "#252219", border: `1px solid ${BORDER}`, color: TEXT,
                        borderRadius: 6, padding: "8px 12px", fontSize: 13, resize: "vertical",
                        minHeight: 72, boxSizing: "border-box", outline: "none", fontFamily: "inherit"
                      }} />
                  ) : (
                    <input type={type} value={draft[key] || ""} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
                      style={{
                        width: "100%", background: "#252219", border: `1px solid ${BORDER}`, color: TEXT,
                        borderRadius: 6, padding: "8px 12px", fontSize: 13, boxSizing: "border-box",
                        outline: "none", fontFamily: "inherit"
                      }} />
                  )}
                </div>
              ))}
              <div>
                <div style={{ color: MUTED, fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>状态</div>
                <select value={draft.status} onChange={e => setDraft(d => ({ ...d, status: e.target.value }))}
                  style={{
                    background: "#252219", border: `1px solid ${BORDER}`, color: TEXT,
                    borderRadius: 6, padding: "8px 12px", fontSize: 13, outline: "none", width: "100%"
                  }}>
                  {["待购买", "高优先级", "考虑中", "已购买"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <div style={{ color: MUTED, fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>优先级</div>
                <select value={draft.priority} onChange={e => setDraft(d => ({ ...d, priority: e.target.value }))}
                  style={{
                    background: "#252219", border: `1px solid ${BORDER}`, color: TEXT,
                    borderRadius: 6, padding: "8px 12px", fontSize: 13, outline: "none", width: "100%"
                  }}>
                  {["高", "中", "低"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button onClick={handleSave} style={{
                  background: ACCENT, border: "none", color: "#0F0E0C",
                  borderRadius: 6, padding: "8px 20px", cursor: "pointer", fontSize: 13, fontWeight: 700
                }}>保存</button>
                <button onClick={() => { setDraft(item); setEditing(false); }} style={{
                  background: "transparent", border: `1px solid ${BORDER}`, color: MUTED,
                  borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 13
                }}>取消</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UploadModal({ onClose, onAdd }) {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
    const reader = new FileReader();
    reader.onload = (e) => setImageBase64(e.target.result.split(",")[1]);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const analyze = async () => {
    if (!imageBase64) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: "image/jpeg", data: imageBase64 }
              },
              {
                type: "text",
                text: `你是一个家居购物助手。请分析这张图片中的家具或家居产品，并以JSON格式返回以下信息（只返回JSON，不要其他文字）：
{
  "name": "家具名称（具体型号或描述）",
  "category": "分类（如：沙发/床/桌子/椅子/储物/灯具/装饰/其他）",
  "estimatedPrice": "估计价格（只填数字，人民币）",
  "reason": "推测用户可能想买这个的原因（从实用性、美观性、功能等角度分析）",
  "alternative": "用户可能已有的替代品建议（如：旧沙发、临时折叠椅等）",
  "notes": "关于这个家具的补充说明（材质、尺寸建议、注意事项等）",
  "status": "待购买",
  "priority": "中"
}`
              }
            ]
          }]
        })
      });
      const data = await res.json();
      const text = data.content.map(i => i.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setError("识别失败，请手动填写信息");
      setResult({ name: "", category: "", estimatedPrice: "", reason: "", alternative: "", notes: "", status: "待购买", priority: "中" });
    }
    setLoading(false);
  };

  const handleAdd = () => {
    if (!result) return;
    onAdd({ ...result, image, id: Date.now() });
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#00000090", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20
    }}>
      <div style={{
        background: CARD_BG, borderRadius: 16, border: `1px solid ${BORDER}`,
        width: "100%", maxWidth: 540, maxHeight: "90vh", overflow: "auto",
        boxShadow: "0 24px 80px #000000A0"
      }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: TEXT, fontWeight: 700, fontSize: 16, fontFamily: "'Playfair Display', serif" }}>添加家具</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 20 }}>×</button>
        </div>

        <div style={{ padding: 24, display: "grid", gap: 16 }}>
          {/* Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current.click()}
            style={{
              border: `2px dashed ${image ? ACCENT : BORDER}`, borderRadius: 12,
              padding: 24, textAlign: "center", cursor: "pointer",
              background: image ? "#1E1B14" : "#13120F",
              transition: "all 0.2s", position: "relative", overflow: "hidden", minHeight: 140
            }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => handleFile(e.target.files[0])} />
            {image ? (
              <img src={image} alt="" style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 8, objectFit: "contain" }} />
            ) : (
              <>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                <div style={{ color: TEXT, fontSize: 14, marginBottom: 4 }}>拍照或上传图片</div>
                <div style={{ color: MUTED, fontSize: 12 }}>点击选择 · 拖拽上传</div>
              </>
            )}
          </div>

          {image && !result && (
            <button onClick={analyze} disabled={loading} style={{
              background: loading ? "#2A2520" : ACCENT, border: "none",
              color: loading ? MUTED : "#0F0E0C", borderRadius: 8, padding: "12px",
              cursor: loading ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}>
              {loading ? (
                <>
                  <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${MUTED}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  AI 识别中...
                </>
              ) : "✨ AI 智能识别"}
            </button>
          )}

          {error && <div style={{ color: "#E07070", fontSize: 12, textAlign: "center" }}>{error}</div>}

          {result && (
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ color: MUTED, fontSize: 11, letterSpacing: 1 }}>识别结果 — 可直接编辑</div>
              {[
                ["name", "家具名称"],
                ["category", "分类"],
                ["estimatedPrice", "预算价格 (¥)"],
                ["reason", "购买理由"],
                ["alternative", "现有替代品"],
                ["notes", "备注"],
              ].map(([key, label]) => (
                <div key={key}>
                  <div style={{ color: MUTED, fontSize: 11, marginBottom: 4 }}>{label}</div>
                  {["reason", "alternative", "notes"].includes(key) ? (
                    <textarea value={result[key] || ""} onChange={e => setResult(r => ({ ...r, [key]: e.target.value }))}
                      style={{
                        width: "100%", background: "#252219", border: `1px solid ${BORDER}`, color: TEXT,
                        borderRadius: 6, padding: "8px 12px", fontSize: 13, resize: "vertical",
                        minHeight: 64, boxSizing: "border-box", outline: "none", fontFamily: "inherit"
                      }} />
                  ) : (
                    <input value={result[key] || ""} onChange={e => setResult(r => ({ ...r, [key]: e.target.value }))}
                      style={{
                        width: "100%", background: "#252219", border: `1px solid ${BORDER}`, color: TEXT,
                        borderRadius: 6, padding: "8px 12px", fontSize: 13, boxSizing: "border-box",
                        outline: "none", fontFamily: "inherit"
                      }} />
                  )}
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ color: MUTED, fontSize: 11, marginBottom: 4 }}>状态</div>
                  <select value={result.status} onChange={e => setResult(r => ({ ...r, status: e.target.value }))}
                    style={{
                      width: "100%", background: "#252219", border: `1px solid ${BORDER}`, color: TEXT,
                      borderRadius: 6, padding: "8px 12px", fontSize: 13, outline: "none"
                    }}>
                    {["待购买", "高优先级", "考虑中", "已购买"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ color: MUTED, fontSize: 11, marginBottom: 4 }}>优先级</div>
                  <select value={result.priority} onChange={e => setResult(r => ({ ...r, priority: e.target.value }))}
                    style={{
                      width: "100%", background: "#252219", border: `1px solid ${BORDER}`, color: TEXT,
                      borderRadius: 6, padding: "8px 12px", fontSize: 13, outline: "none"
                    }}>
                    {["高", "中", "低"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleAdd} style={{
                background: ACCENT, border: "none", color: "#0F0E0C",
                borderRadius: 8, padding: "12px", cursor: "pointer", fontSize: 14, fontWeight: 700, marginTop: 4
              }}>加入清单</button>
            </div>
          )}

          {!image && (
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
              <div style={{ color: MUTED, fontSize: 12, textAlign: "center", marginBottom: 12 }}>或者手动添加</div>
              <button onClick={() => setResult({ name: "", category: "", estimatedPrice: "", reason: "", alternative: "", notes: "", status: "待购买", priority: "中" })}
                style={{
                  width: "100%", background: "transparent", border: `1px solid ${BORDER}`, color: TEXT,
                  borderRadius: 8, padding: "10px", cursor: "pointer", fontSize: 13
                }}>手动填写</button>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [showModal, setShowModal] = useState(false);
  const [budget, setBudget] = useState("");
  const [filter, setFilter] = useState("全部");

  const addItem = (item) => setItems(prev => [item, ...prev]);
  const deleteItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const updateItem = (updated) => setItems(prev => prev.map(i => i.id === updated.id ? updated : i));

  const filters = ["全部", "待购买", "高优先级", "考虑中", "已购买"];
  const filtered = filter === "全部" ? items : items.filter(i => i.status === filter);

  const totalEstimated = items
    .filter(i => i.status !== "已购买")
    .reduce((s, i) => s + (parseFloat(i.estimatedPrice) || 0), 0);
  const totalPurchased = items
    .filter(i => i.status === "已购买")
    .reduce((s, i) => s + (parseFloat(i.estimatedPrice) || 0), 0);
  const budgetNum = parseFloat(budget) || 0;
  const remaining = budgetNum - totalEstimated;

  return (
    <div style={{
      minHeight: "100vh", background: BG, color: TEXT,
      fontFamily: "'DM Sans', 'Noto Sans SC', sans-serif",
      paddingBottom: 60
    }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${BORDER}`, padding: "24px 24px 20px",
        background: "#0D0C0A"
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
            <h1 style={{
              margin: 0, fontFamily: "'Playfair Display', serif", fontStyle: "italic",
              fontSize: 26, fontWeight: 700, color: TEXT, letterSpacing: -0.5
            }}>家居购置清单</h1>
            <span style={{ color: MUTED, fontSize: 12 }}>Furniture Wishlist</span>
          </div>
          <p style={{ margin: 0, color: MUTED, fontSize: 13 }}>拍照上传，AI 自动整理 · 追踪预算与优先级</p>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px" }}>
        {/* Budget Panel */}
        <div style={{
          margin: "20px 0", background: CARD_BG, borderRadius: 12, border: `1px solid ${BORDER}`,
          padding: "16px 20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ color: MUTED, fontSize: 11, letterSpacing: 1 }}>总预算</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
              <span style={{ color: ACCENT }}>¥</span>
              <input
                type="number" placeholder="输入预算金额"
                value={budget} onChange={e => setBudget(e.target.value)}
                style={{
                  background: "transparent", border: "none", outline: "none",
                  color: TEXT, fontSize: 18, fontWeight: 700, width: "100%"
                }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              ["待购总额", `¥${totalEstimated.toLocaleString()}`, totalEstimated > budgetNum && budgetNum > 0 ? "#E07070" : ACCENT],
              ["已购花费", `¥${totalPurchased.toLocaleString()}`, "#6EC87A"],
              ["预算余量", budgetNum > 0 ? `¥${remaining.toLocaleString()}` : "—", remaining < 0 ? "#E07070" : "#6EC87A"],
            ].map(([label, val, color]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ color: MUTED, fontSize: 10, letterSpacing: 1, marginBottom: 2 }}>{label}</div>
                <div style={{ color, fontSize: 15, fontWeight: 700 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? ACCENT : "transparent",
              border: `1px solid ${filter === f ? ACCENT : BORDER}`,
              color: filter === f ? "#0F0E0C" : MUTED,
              borderRadius: 20, padding: "6px 16px", cursor: "pointer",
              fontSize: 12, fontWeight: filter === f ? 700 : 400, whiteSpace: "nowrap",
              transition: "all 0.15s"
            }}>
              {f}
              {f !== "全部" && (
                <span style={{ marginLeft: 4, opacity: 0.7 }}>
                  {items.filter(i => i.status === f).length}
                </span>
              )}
              {f === "全部" && <span style={{ marginLeft: 4, opacity: 0.7 }}>{items.length}</span>}
            </button>
          ))}
        </div>

        {/* Items */}
        <div style={{ display: "grid", gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{
              textAlign: "center", padding: "60px 20px",
              color: MUTED, border: `1px dashed ${BORDER}`, borderRadius: 12
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
              <div style={{ fontSize: 14, marginBottom: 4 }}>清单为空</div>
              <div style={{ fontSize: 12 }}>点击下方按钮添加第一件家具</div>
            </div>
          )}
          {filtered.map(item => (
            <ItemCard key={item.id} item={item} onDelete={deleteItem} onUpdate={updateItem} />
          ))}
        </div>
      </div>

      {/* FAB */}
      <button onClick={() => setShowModal(true)} style={{
        position: "fixed", bottom: 28, right: 24,
        background: ACCENT, border: "none", color: "#0F0E0C",
        width: 56, height: 56, borderRadius: "50%", fontSize: 26,
        cursor: "pointer", boxShadow: `0 4px 20px ${ACCENT}60`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "transform 0.15s, box-shadow 0.15s"
      }}>+</button>

      {showModal && <UploadModal onClose={() => setShowModal(false)} onAdd={addItem} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;600;700&family=Noto+Sans+SC:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${BORDER}; border-radius: 2px; }
      `}</style>
    </div>
  );
}
