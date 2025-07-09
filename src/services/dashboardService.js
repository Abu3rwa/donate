import { db } from "../config/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  getCountFromServer,
  startAfter,
} from "firebase/firestore";

// 1. Dashboard statistics (totals)
export const listenDashboardStats = (onData, onError) => {
  const donationsRef = collection(db, "donations");
  const donorsRef = collection(db, "donors");
  const campaignsRef = collection(db, "campaigns");

  const unsubDonations = onSnapshot(
    donationsRef,
    async (snapshot) => {
      let totalDonations = 0;
      let thisMonthDonations = 0;
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      snapshot.forEach((doc) => {
        const data = doc.data();
        totalDonations += data.amount || 0;
        const date = data.date ? data.date.toDate() : null;
        if (
          date &&
          date.getMonth() === thisMonth &&
          date.getFullYear() === thisYear
        ) {
          thisMonthDonations += data.amount || 0;
        }
      });

      const donorsSnap = await getCountFromServer(donorsRef);
      const campaignsSnap = await getCountFromServer(campaignsRef);

      onData({
        totalDonations,
        totalDonors: donorsSnap.data().count,
        activeCampaigns: campaignsSnap.data().count,
        thisMonthDonations,
      });
    },
    onError
  );

  return () => {
    unsubDonations();
  };
};

// 2. Recent donations (real-time)
export const listenRecentDonations = (onData, onError, max = 10) => {
  const q = query(
    collection(db, "donations"),
    orderBy("date", "desc"),
    limit(max)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const donations = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
      }));
      onData(donations);
    },
    onError
  );
};

// 3. Campaign progress (real-time)
export const listenCampaigns = (onData, onError) => {
  const q = query(collection(db, "campaigns"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const campaigns = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      onData(campaigns);
    },
    onError
  );
};

// 4. Activity feed (real-time)
export const listenActivityFeed = (onData, onError, max = 10) => {
  const q = query(
    collection(db, "activities"),
    orderBy("time", "desc"),
    limit(max)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const activities = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        time: doc.data().time?.toDate(),
      }));
      onData(activities);
    },
    onError
  );
};

// Paginated donations fetcher
/**
 * Fetches the next page of donations for pagination.
 * @param {DocumentSnapshot} lastDoc - The last document from the previous page.
 * @param {number} pageSize - Number of donations per page.
 * @param {function} onData - Callback for data.
 * @param {function} onError - Callback for error.
 * @returns {function} Unsubscribe function.
 */
export const fetchDonationsPage = (lastDoc, pageSize, onData, onError) => {
  let q = query(
    collection(db, "donations"),
    orderBy("date", "desc"),
    limit(pageSize)
  );
  if (lastDoc) {
    q = query(
      collection(db, "donations"),
      orderBy("date", "desc"),
      startAfter(lastDoc),
      limit(pageSize)
    );
  }
  return onSnapshot(
    q,
    (snapshot) => {
      const donations = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
      }));
      onData(donations, snapshot.docs[snapshot.docs.length - 1]);
    },
    onError
  );
};

// TODO: Implement caching and smart invalidation for dashboard statistics using localStorage or SWR.
