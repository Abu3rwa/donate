import { renderHook, act } from "@testing-library/react";
import { useOrgDocuments } from "./hooks/useOrgDocuments";
import { formatDate } from "./utils/dateUtils";
import { getFileType } from "./utils/fileUtils";
import * as orgFilesService from "../../services/orgFilesService";

jest.mock("../../config/firebase", () => ({
  db: {},
  storage: {},
  auth: {},
}));
jest.mock("../../services/orgFilesService");

// --- Unit Tests for dateUtils ---
describe("formatDate", () => {
  it("should return an empty string if the timestamp is null or undefined", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
  });

  it("should format a Firestore Timestamp object correctly", () => {
    const mockTimestamp = {
      seconds: 1678886400, // March 15, 2023
      nanoseconds: 0,
      toDate: () => new Date(1678886400 * 1000),
    };
    // Note: The exact string depends on the test environment's locale.
    // This test assumes an environment that produces '١٥ مارس ٢٠٢٣' for 'ar-EG'.
    // It might need adjustment if the environment differs.
    const expectedDate = new Date(
      mockTimestamp.seconds * 1000
    ).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    expect(formatDate(mockTimestamp)).toBe(expectedDate);
  });

  it("should format a valid date string correctly", () => {
    const dateString = "2023-03-15T12:00:00.000Z";
    const expectedDate = new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    expect(formatDate(dateString)).toBe(expectedDate);
  });

  it('should return "تاريخ غير صالح" for an invalid date string', () => {
    expect(formatDate("not a date")).toBe("تاريخ غير صالح");
  });
});

// --- Unit Tests for fileUtils ---
describe("getFileType", () => {
  it("should correctly identify image files", () => {
    expect(getFileType("photo.jpg")).toBe("Images");
    expect(getFileType("document.PNG")).toBe("Images");
    expect(getFileType("archive.gif")).toBe("Images");
  });

  it("should correctly identify PDF files", () => {
    expect(getFileType("report.pdf")).toBe("PDFs");
  });

  it("should correctly identify document files", () => {
    expect(getFileType("letter.docx")).toBe("Documents");
    expect(getFileType("notes.txt")).toBe("Documents");
  });

  it("should correctly identify spreadsheet files", () => {
    expect(getFileType("data.xlsx")).toBe("Spreadsheets");
    expect(getFileType("sheet.csv")).toBe("Spreadsheets");
  });

  it("should correctly identify presentation files", () => {
    expect(getFileType("slides.pptx")).toBe("Presentations");
  });

  it("should correctly identify video files", () => {
    expect(getFileType("movie.mp4")).toBe("Videos");
    expect(getFileType("clip.MOV")).toBe("Videos");
  });

  it('should classify unknown extensions as "Other"', () => {
    expect(getFileType("archive.zip")).toBe("Other");
    expect(getFileType("data.json")).toBe("Other");
    expect(getFileType("file-without-extension")).toBe("Other");
  });
});

// --- Tests for useOrgDocuments Hook ---
describe("useOrgDocuments", () => {
  const mockShowSuccess = jest.fn();
  const mockShowError = jest.fn();
  const mockUser = { displayName: "Test User", email: "test@example.com" };

  // Mock useAuth hook
  jest.mock("../../contexts/AuthContext", () => ({
    useAuth: () => ({ user: mockUser }),
  }));

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("should fetch documents on initial load", async () => {
    const mockDocs = [{ id: "1", name: "test.pdf", category: "testing" }];
    orgFilesService.fetchOrgDocuments.mockResolvedValue(mockDocs);

    const { result, waitForNextUpdate } = renderHook(() =>
      useOrgDocuments(mockShowSuccess, mockShowError)
    );

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.documents).toEqual(mockDocs);
    expect(orgFilesService.fetchOrgDocuments).toHaveBeenCalledTimes(1);
  });

  it("should handle upload successfully", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useOrgDocuments(mockShowSuccess, mockShowError)
    );

    const file = new File(["content"], "new_doc.pdf", { type: "application/pdf" });
    const category = "new_category";

    orgFilesService.uploadOrgDocument.mockResolvedValue({});
    orgFilesService.fetchOrgDocuments.mockResolvedValue([]); // Mock refresh call

    await act(async () => {
      await result.current.handleUpload(file, category);
    });

    expect(result.current.uploading).toBe(false);
    expect(orgFilesService.uploadOrgDocument).toHaveBeenCalledWith(file, {
      category,
      uploadedBy: mockUser.displayName,
    });
    expect(mockShowSuccess).toHaveBeenCalledWith("تم رفع الملف بنجاح!");
    expect(orgFilesService.fetchOrgDocuments).toHaveBeenCalledTimes(2); // Initial + refresh
  });

  it("should handle delete successfully", async () => {
    const docToDelete = { id: "1", name: "test.pdf", storagePath: "files/test.pdf" };
    orgFilesService.fetchOrgDocuments.mockResolvedValue([docToDelete]);

    const { result, waitForNextUpdate } = renderHook(() =>
      useOrgDocuments(mockShowSuccess, mockShowError)
    );

    await waitForNextUpdate(); // Wait for initial fetch

    orgFilesService.deleteOrgDocument.mockResolvedValue({});

    await act(async () => {
      await result.current.handleDelete(docToDelete);
    });

    expect(orgFilesService.deleteOrgDocument).toHaveBeenCalledWith(docToDelete.id, docToDelete.storagePath);
    expect(mockShowSuccess).toHaveBeenCalledWith("تم حذف الملف بنجاح!");
    expect(orgFilesService.fetchOrgDocuments).toHaveBeenCalledTimes(2); // Initial + refresh
  });

  it("should handle fetch error", async () => {
    orgFilesService.fetchOrgDocuments.mockRejectedValue(new Error("Fetch failed"));

    const { result, waitForNextUpdate } = renderHook(() =>
      useOrgDocuments(mockShowSuccess, mockShowError)
    );

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.documents).toEqual([]);
    expect(mockShowError).toHaveBeenCalledWith("فشل تحميل الملفات. يرجى المحاولة مرة أخرى.");
  });
});
