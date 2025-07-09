import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  limit,
  startAfter,
  getCountFromServer,
  Timestamp,
  increment,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";

// Utility functions
const formatCurrency = (amount) =>
  new Intl.NumberFormat("ar-SD", {
    style: "currency",
    currency: "SDG",
    minimumFractionDigits: 0,
  }).format(amount);

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat("ar-SD", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// 1. Fetch all donations with pagination and filters
export const fetchDonations = async (filters = {}) => {
  try {
    const {
      status = "all",
      campaign = "all",
      dateRange = "all",
      limit: limitCount = 50,
      startAfter: lastDoc = null,
    } = filters;

    let q = query(collection(db, "donations"), orderBy("createdAt", "desc"));

    // Apply status filter
    if (status !== "all") {
      q = query(q, where("status", "==", status));
    }

    // Apply campaign filter
    if (campaign !== "all") {
      q = query(q, where("campaign", "==", campaign));
    }

    // Apply date range filter
    if (dateRange !== "all") {
      const now = new Date();
      let startDate;
      
      switch (dateRange) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        q = query(q, where("createdAt", ">=", Timestamp.fromDate(startDate)));
      }
    }

    // Apply pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc), limit(limitCount));
    } else {
      q = query(q, limit(limitCount));
    }

    const snapshot = await getDocs(q);
    const donations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      formattedAmount: formatCurrency(doc.data().amount || 0),
      formattedDate: formatDate(doc.data().createdAt),
    }));

    return {
      donations,
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
      hasMore: snapshot.docs.length === limitCount,
    };
  } catch (error) {
    console.error("Error fetching donations:", error);
    throw new Error("فشل في تحميل التبرعات");
  }
};

// 2. Add new donation
export const addDonation = async (donationData) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    // Use the status from the form, default to 'pending' if not provided
    const donation = {
      ...donationData,
      createdAt: serverTimestamp(),
      createdBy: user?.uid || "admin_manual_entry",
      status: donationData.status || "pending",
      currency: "SDG",
      paymentMethod: "manual_entry",
    };

    const docRef = await addDoc(collection(db, "donations"), donation);

    // Update campaign raised amount if campaign is specified
    if (donation.campaign) {
      const campaignRef = doc(db, "campaigns", donation.campaign);
      try {
        await updateDoc(campaignRef, {
          raised: increment(Number(donation.amount)),
        });
      } catch (e) {
        // Fallback to currentAmount if raised doesn't exist
        await updateDoc(campaignRef, {
          currentAmount: increment(Number(donation.amount)),
        });
      }
    }

    toast.success("تمت إضافة التبرع بنجاح!");
    return { id: docRef.id, ...donation };
  } catch (error) {
    console.error("Error adding donation:", error);
    toast.error("حدث خطأ أثناء إضافة التبرع");
    throw error;
  }
};

// 3. Update donation
export const updateDonation = async (donationId, updates) => {
  try {
    const donationRef = doc(db, "donations", donationId);
    await updateDoc(donationRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    toast.success("تم تحديث التبرع بنجاح!");
  } catch (error) {
    console.error("Error updating donation:", error);
    toast.error("حدث خطأ أثناء تحديث التبرع");
    throw error;
  }
};

// 4. Delete donation
export const deleteDonation = async (donationId) => {
  try {
    const donationRef = doc(db, "donations", donationId);
    await deleteDoc(donationRef);
    toast.success("تم حذف التبرع بنجاح!");
  } catch (error) {
    console.error("Error deleting donation:", error);
    toast.error("حدث خطأ أثناء حذف التبرع");
    throw error;
  }
};

// 5. Get donation statistics
export const getDonationStats = async (filters = {}) => {
  try {
    const { dateRange = "all", campaign = "all" } = filters;

    let q = query(collection(db, "donations"));

    // Apply date range filter
    if (dateRange !== "all") {
      const now = new Date();
      let startDate;
      
      switch (dateRange) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        q = query(q, where("createdAt", ">=", Timestamp.fromDate(startDate)));
      }
    }

    // Apply campaign filter
    if (campaign !== "all") {
      q = query(q, where("campaign", "==", campaign));
    }

    const snapshot = await getDocs(q);
    const donations = snapshot.docs.map((doc) => doc.data());

    const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const totalDonations = donations.length;
    const completedDonations = donations.filter((d) => d.status === "completed").length;
    const pendingDonations = donations.filter((d) => d.status === "pending").length;
    const uniqueDonors = new Set(donations.map((d) => d.donorEmail || d.donorPhone)).size;

    return {
      totalAmount,
      totalDonations,
      completedDonations,
      pendingDonations,
      uniqueDonors,
      averageAmount: totalDonations > 0 ? totalAmount / totalDonations : 0,
    };
  } catch (error) {
    console.error("Error fetching donation stats:", error);
    throw new Error("فشل في تحميل إحصائيات التبرعات");
  }
};

// 6. Real-time donations listener
export const listenDonations = (filters, onData, onError) => {
  try {
    const {
      status = "all",
      campaign = "all",
      limit: limitCount = 50,
    } = filters;

    let q = query(collection(db, "donations"), orderBy("createdAt", "desc"));

    if (status !== "all") {
      q = query(q, where("status", "==", status));
    }

    if (campaign !== "all") {
      q = query(q, where("campaign", "==", campaign));
    }

    q = query(q, limit(limitCount));

    return onSnapshot(
      q,
      (snapshot) => {
        const donations = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          formattedAmount: formatCurrency(doc.data().amount || 0),
          formattedDate: formatDate(doc.data().createdAt),
        }));
        onData(donations);
      },
      onError
    );
  } catch (error) {
    console.error("Error setting up donations listener:", error);
    onError(error);
  }
};

// 7. Get donation by ID
export const getDonationById = async (donationId) => {
  try {
    const donationRef = doc(db, "donations", donationId);
    const snapshot = await getDocs(donationRef);
    
    if (!snapshot.exists()) {
      throw new Error("التبرع غير موجود");
    }

    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      formattedAmount: formatCurrency(data.amount || 0),
      formattedDate: formatDate(data.createdAt),
    };
  } catch (error) {
    console.error("Error fetching donation by ID:", error);
    throw error;
  }
};

// 8. Search donations
export const searchDonations = async (searchTerm, filters = {}) => {
  try {
    const { status = "all", campaign = "all", limit: limitCount = 50 } = filters;

    let q = query(collection(db, "donations"), orderBy("createdAt", "desc"));

    if (status !== "all") {
      q = query(q, where("status", "==", status));
    }

    if (campaign !== "all") {
      q = query(q, where("campaign", "==", campaign));
    }

    q = query(q, limit(limitCount));

    const snapshot = await getDocs(q);
    let donations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      formattedAmount: formatCurrency(doc.data().amount || 0),
      formattedDate: formatDate(doc.data().createdAt),
    }));

    // Client-side search filtering
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      donations = donations.filter((donation) =>
        donation.donorName?.toLowerCase().includes(term) ||
        donation.donorPhone?.includes(term) ||
        donation.donorEmail?.toLowerCase().includes(term) ||
        donation.notes?.toLowerCase().includes(term)
      );
    }

    return donations;
  } catch (error) {
    console.error("Error searching donations:", error);
    throw new Error("فشل في البحث في التبرعات");
  }
};

// 9. Export donations to CSV
export const exportDonations = async (filters = {}) => {
  try {
    const { donations } = await fetchDonations({ ...filters, limit: 1000 });
    
    const csvHeaders = [
      "ID",
      "اسم المتبرع",
      "رقم الهاتف",
      "البريد الإلكتروني",
      "المبلغ",
      "العملة",
      "الحملة",
      "الحالة",
      "نوع التبرع",
      "تاريخ الإنشاء",
      "ملاحظات",
    ];

    const csvData = donations.map((donation) => [
      donation.id,
      donation.donorName || "",
      donation.donorPhone || "",
      donation.donorEmail || "",
      donation.amount || 0,
      donation.currency || "SDG",
      donation.campaign || "",
      donation.status || "",
      donation.recurringDonation ? "متكرر" : "مرة واحدة",
      donation.formattedDate || "",
      donation.notes || "",
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `donations_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("تم تصدير التبرعات بنجاح!");
  } catch (error) {
    console.error("Error exporting donations:", error);
    toast.error("حدث خطأ أثناء تصدير التبرعات");
    throw error;
  }
}; 