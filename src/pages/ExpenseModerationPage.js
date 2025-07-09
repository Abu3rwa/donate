import React, { useEffect, useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";

// --- MOCK API SERVICE ---
// In a real app, this would be in a separate file (e.g., services/expenseModerationService.js)
// I've included it here with mock data to make the component runnable.
const mockExpenses = [
    { id: 'exp001', description: 'تجهيز وتوريد مستلزمات مكتبية للمقر الرئيسي. يشمل الأوراق والأقلام والملفات.', amount: 15000, category: 'purchase', status: 'pending', submittedBy: 'أحمد علي', createdAt: new Date(2024, 5, 20).toISOString(), files: [{ url: '#', name: 'invoice.pdf' }] },
    { id: 'exp002', description: 'تكاليف وقود لسيارة التوزيع لشهر يونيو.', amount: 8500, category: 'operations', status: 'pending', submittedBy: 'فاطمة الزهراء', createdAt: new Date(2024, 5, 22).toISOString(), files: [] },
    { id: 'exp003', description: 'دفعة مقدمة من راتب الموظف محمد صالح.', amount: 25000, category: 'salary', status: 'approved', submittedBy: 'قسم الموارد البشرية', createdAt: new Date(2024, 5, 15).toISOString() },
    { id: 'exp004', description: 'تبرع لصالح حملة إفطار صائم.', amount: 5000, category: 'donation', status: 'rejected', submittedBy: 'قسم العلاقات العامة', createdAt: new Date(2024, 4, 10).toISOString() },
    { id: 'exp005', description: 'صيانة دورية لأجهزة التكييف في المكتب.', amount: 7200, category: 'other', status: 'pending', submittedBy: 'إدارة المبنى', createdAt: new Date(2024, 5, 25).toISOString(), files: [{ url: '#', name: 'maintenance_quote.pdf' }] },
];

const mockComments = {
    'exp001': [{ id: 'c1', type: 'comment', text: 'يرجى مراجعة الفاتورة المرفقة.', author: 'المحاسبة', createdAt: new Date(2024, 5, 21).toISOString() }],
    'exp004': [
        { id: 'c2', type: 'comment', text: 'هل هذه الحملة معتمدة من الإدارة؟', author: 'مشرف', createdAt: new Date(2024, 4, 10).toISOString() },
        { id: 'c3', type: 'reject', text: 'تم الرفض لعدم وجود موافقة مسبقة.', author: 'المدير المالي', createdAt: new Date(2024, 4, 11).toISOString() }
    ],
};

const expenseModerationService = {
    getExpenses: async () => {
        console.log("Fetching expenses...");
        await new Promise(res => setTimeout(res, 1000));
        return [...mockExpenses];
    },
    approveExpense: async (id, comment, author) => {
        console.log(`Approving expense ${id} with comment: "${comment}"`);
        await new Promise(res => setTimeout(res, 500));
        if (comment) mockComments[id] = [...(mockComments[id] || []), { id: `c${Date.now()}`, type: 'approve', text: comment, author, createdAt: new Date().toISOString() }];
        return { success: true };
    },
    rejectExpense: async (id, comment, author) => {
        console.log(`Rejecting expense ${id} with comment: "${comment}"`);
        await new Promise(res => setTimeout(res, 500));
        if (comment) mockComments[id] = [...(mockComments[id] || []), { id: `c${Date.now()}`, type: 'reject', text: comment, author, createdAt: new Date().toISOString() }];
        return { success: true };
    },
    addExpenseComment: async (id, newComment) => {
        console.log(`Adding comment to expense ${id}: "${newComment.text}"`);
        await new Promise(res => setTimeout(res, 500));
        mockComments[id] = [...(mockComments[id] || []), { ...newComment, id: `c${Date.now()}`, type: 'comment', createdAt: new Date().toISOString() }];
        return { success: true };
    },
    getExpenseComments: async (expenseId) => {
        console.log(`Fetching comments for expense ${expenseId}...`);
        await new Promise(res => setTimeout(res, 500));
        return mockComments[expenseId] || [];
    },
};
// --- END MOCK API SERVICE ---


const STATUS_LABELS = {
    pending: "قيد المراجعة",
    approved: "مقبول",
    rejected: "مرفوض",
};

const CATEGORY_LABELS = {
    operations: "تشغيلية",
    purchase: "شراء",
    salary: "راتب",
    donation: "تبرع",
    other: "أخرى",
};

function StatusBadge({ status }) {
    const statusStyles = {
        approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || ''}`}>
            {STATUS_LABELS[status] || status}
        </span>
    );
}

function ExpenseCommentThread({ expenseId, onCommentAdded }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        setLoading(true);
        try {
            const data = await expenseModerationService.getExpenseComments(expenseId);
            setComments(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            setComments([]);
            toast.error("فشل في تحميل التعليقات.");
        } finally {
            setLoading(false);
        }
    }, [expenseId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);
    
    useEffect(() => {
        if(onCommentAdded) {
            fetchComments();
        }
    }, [onCommentAdded, fetchComments]);


    if (loading) return <div className="text-sm text-gray-400 py-4 text-center">جاري تحميل التعليقات...</div>;

    return (
        <div className="space-y-3 mt-2">
            {comments.length === 0 ? (
                 <div className="text-sm text-gray-400 py-4 text-center">لا توجد تعليقات بعد.</div>
            ) : (
                comments.map((c) => (
                    <div key={c.id} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 text-sm">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="font-bold text-gray-800 dark:text-gray-200">{c.author || "مشرف"}</span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">{c.createdAt ? new Date(c.createdAt).toLocaleString("ar-EG") : "-"}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{c.text}</p>
                        {c.type !== "comment" && (
                            <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${c.type === 'approve' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {c.type === "approve" ? "موافقة" : "رفض"}
                            </span>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}


function ExpenseDetailModal({ expense, onClose, onAction }) {
    const [comment, setComment] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [commentAdded, setCommentAdded] = useState(0);

    const handleAction = async (actionType) => {
        if (actionType !== 'comment' && !comment.trim()) {
            toast.error("التعليق مطلوب عند الرفض أو الموافقة.");
            return;
        }
        setActionLoading(true);
        try {
            await onAction(actionType, expense.id, comment);
            setComment("");
            if (actionType === 'comment') {
                setCommentAdded(c => c + 1);
            } else {
                onClose();
            }
        } finally {
            setActionLoading(false);
        }
    };
    
    // Close modal on 'Escape' key press
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);


    if (!expense) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">تفاصيل المصروف</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">مراجعة واتخاذ إجراء</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                <main className="p-4 sm:p-5 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                            <label className="text-xs text-gray-500 dark:text-gray-400">المبلغ</label>
                            <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{expense.amount.toLocaleString('ar-EG')} ج.س</p>
                        </div>
                         <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                            <label className="text-xs text-gray-500 dark:text-gray-400">التصنيف</label>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{CATEGORY_LABELS[expense.category] || expense.category}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                            <label className="text-xs text-gray-500 dark:text-gray-400">المُقدِّم</label>
                            <p className="text-gray-800 dark:text-gray-200">{expense.submittedBy || "غير معروف"}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                            <label className="text-xs text-gray-500 dark:text-gray-400">تاريخ التقديم</label>
                            <p className="text-gray-800 dark:text-gray-200">{expense.createdAt ? new Date(expense.createdAt).toLocaleDateString("ar-EG") : "-"}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg mb-4">
                        <label className="text-xs text-gray-500 dark:text-gray-400">الوصف</label>
                        <p className="text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap">{expense.description}</p>
                    </div>

                    {expense.files && expense.files.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">المرفقات</h4>
                            <div className="flex flex-wrap gap-2">
                                {expense.files.map((file, idx) => (
                                    <a key={idx} href={file.url} target="_blank" rel="noopener noreferrer" className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 transition flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                                        {file.name || `مرفق ${idx + 1}`}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">سجل التعليقات</h4>
                        <ExpenseCommentThread expenseId={expense.id} onCommentAdded={commentAdded} />
                    </div>
                </main>
                
                {expense.status === 'pending' && (
                    <footer className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex flex-col gap-3">
                            <textarea
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="أضف تعليقًا (مطلوب عند الموافقة أو الرفض)..."
                                rows="3"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                disabled={actionLoading}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <button onClick={() => handleAction('approve')} disabled={actionLoading || !comment.trim()} className="w-full py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                    {actionLoading ? "..." : "موافقة"}
                                </button>
                                <button onClick={() => handleAction('reject')} disabled={actionLoading || !comment.trim()} className="w-full py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                    {actionLoading ? "..." : "رفض"}
                                </button>
                                <button onClick={() => handleAction('comment')} disabled={actionLoading || !comment.trim()} className="w-full py-2.5 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                    {actionLoading ? "..." : "إضافة تعليق فقط"}
                                </button>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
}

// Main Page Component
export default function ExpenseModerationPage() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selectedExpense, setSelectedExpense] = useState(null);

    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await expenseModerationService.getExpenses();
            setExpenses(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            setError("فشل في تحميل المصروفات.");
            toast.error("فشل في تحميل المصروفات.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleAction = async (actionType, id, comment) => {
        try {
            let successMessage = "";
            if (actionType === 'approve') {
                await expenseModerationService.approveExpense(id, comment, "مشرف");
                successMessage = "تمت الموافقة على المصروف بنجاح.";
            } else if (actionType === 'reject') {
                await expenseModerationService.rejectExpense(id, comment, "مشرف");
                successMessage = "تم رفض المصروف بنجاح.";
            } else if (actionType === 'comment') {
                await expenseModerationService.addExpenseComment(id, { text: comment, author: "مشرف" });
                successMessage = "تمت إضافة التعليق بنجاح.";
            }
            
            toast.success(successMessage);

            if(actionType !== 'comment') {
                // Update the status locally without re-fetching
                setExpenses(prev =>
                    prev.map(item =>
                        item.id === id ? { ...item, status: actionType === 'approve' ? 'approved' : 'rejected' } : item
                    )
                );
            }
        } catch (err) {
            toast.error(`فشل الإجراء: ${err.message || 'حدث خطأ ما'}`);
        }
    };

    const filteredExpenses = useMemo(() => {
        return expenses
            .filter(item => categoryFilter === "all" || item.category === categoryFilter)
            .filter(item => statusFilter === "all" || item.status === statusFilter)
            .filter(item =>
                search.trim() === "" ||
                (item.description || "").toLowerCase().includes(search.trim().toLowerCase()) ||
                (item.submittedBy || "").toLowerCase().includes(search.trim().toLowerCase())
            );
    }, [expenses, categoryFilter, statusFilter, search]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
                <header className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">مراجعة المصروفات</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">إدارة ومراجعة جميع المصروفات والمعاملات المالية في المنصة.</p>
                </header>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        className="flex-grow rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                        placeholder="ابحث بالوصف أو اسم المُقدِّم..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="grid grid-cols-2 md:flex gap-3">
                        <select
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">كل التصنيفات</option>
                            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                        <select
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">كل الحالات</option>
                            {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="mr-3 text-gray-600 dark:text-gray-400">جاري تحميل المصروفات...</span>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                        <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">حدث خطأ</h3>
                        <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                    </div>
                ) : filteredExpenses.length === 0 ? (
                    <div className="text-center py-16">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">لا توجد نتائج</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">لم يتم العثور على مصروفات مطابقة للبحث أو الفلاتر.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="p-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">التاريخ</th>
                                    <th className="p-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">الوصف</th>
                                    <th className="p-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">التصنيف</th>
                                    <th className="p-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">المبلغ</th>
                                    <th className="p-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">الحالة</th>
                                    <th className="p-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">الإجراء</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredExpenses.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString("ar-EG") : "-"}</td>
                                        <td className="p-4 max-w-sm">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.description}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">بواسطة: {item.submittedBy || "غير معروف"}</p>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{CATEGORY_LABELS[item.category] || item.category}</td>
                                        <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.amount.toLocaleString('ar-EG')} ج.س</td>
                                        <td className="p-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                                        <td className="p-4 whitespace-nowrap">
                                            <button onClick={() => setSelectedExpense(item)} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 text-sm transition">
                                                مراجعة
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <ExpenseDetailModal
                    expense={selectedExpense}
                    onClose={() => setSelectedExpense(null)}
                    onAction={handleAction}
                />
            </div>
        </div>
    );
}
