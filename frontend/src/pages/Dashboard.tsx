import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Upload,
  Search,
  Settings,
  User,
  LogOut,
  FileText,
  Image as ImageIcon,
  File,
  FolderOpen,
  RefreshCw,
  ExternalLink,
  X,
  Sparkles,
  ShieldCheck,
  Clock3,
  Database,
  CheckCircle2,
  FileArchive,
  Presentation,
  Code2,
} from "lucide-react";

import { DocumentItem } from "../types";
import {
  fetchUserDocuments,
  uploadDocumentFile,
} from "../services/Api";

type LocalDocument = DocumentItem & {
  localUrl?: string;
  originalFile?: File;
};

export default function Dashboard() {
  const [documents, setDocuments] = useState<LocalDocument[]>([]);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadMessage, setUploadMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // =========================================================
  // LOAD FILES
  // =========================================================

  const loadDocuments = async () => {
    try {
      setLoading(true);

      const response = await fetchUserDocuments("all");

      const data = Array.isArray(response)
        ? response
        : (response as any)?.documents || [];

      setDocuments(data as LocalDocument[]);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return documents;
    }

    return documents.filter((doc) => {
      const filename = String(doc.filename || "").toLowerCase();
      const fileType = String(doc.file_type || "").toLowerCase();

      return (
        filename.includes(query) ||
        fileType.includes(query)
      );
    });
  }, [documents, search]);

  // =========================================================
  // UPLOAD
  // =========================================================

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);
    setUploadMessage("");

    let uploadedCount = 0;

    try {
      for (const file of Array.from(files)) {
        try {
          const response: any = await uploadDocumentFile(file);

          /*
           * Backend response madhun URL milala tar use karto.
           * URL nasel tar current browser session sathi
           * local object URL create karto.
           */

          const backendUrl =
            response?.file_url ||
            response?.url ||
            response?.download_url ||
            response?.path ||
            response?.file?.url ||
            "";

          const localUrl = backendUrl || URL.createObjectURL(file);

          const newDocument: LocalDocument = {
  id:
    response?.id ||
    response?.document_id ||
    `local-${Date.now()}-${Math.random()}`,

  user_id: response?.user_id || "",

  filename: file.name,

  storage_path:
    response?.storage_path ||
    response?.path ||
    "",

  file_type:
    response?.file_type ||
    "other",

  file_size: file.size,

  mime_type: file.type || undefined,

  summary: response?.summary || "",

  status:
    response?.status ||
    "indexed",

  error_message: response?.error_message,

  metadata: response?.metadata,

  created_at:
    response?.created_at ||
    new Date().toISOString(),

  updated_at:
    response?.updated_at ||
    new Date().toISOString(),

  localUrl,
  originalFile: file,
};

          /*
           * Immediately UI madhe file add karto.
           * Backend refresh chi wait karaychi garaj nahi.
           */
          setDocuments((prev) => {
            const alreadyExists = prev.some(
              (doc) =>
                doc.filename === newDocument.filename &&
                doc.id !== newDocument.id
            );

            if (alreadyExists) {
              return prev;
            }

            return [newDocument, ...prev];
          });

          uploadedCount++;
        } catch (error) {
          console.error(
            `Upload failed for ${file.name}`,
            error
          );
        }
      }

      if (uploadedCount > 0) {
        setUploadMessage(
          `${uploadedCount} file${
            uploadedCount > 1 ? "s" : ""
          } uploaded successfully.`
        );

        /*
         * Backend madhun latest list gheun yeto.
         * Local files pan preserve karto.
         */
        try {
          const response = await fetchUserDocuments("all");

          const backendDocuments = Array.isArray(response)
            ? response
            : (response as any)?.documents || [];

          if (backendDocuments.length > 0) {
            setDocuments((current) => {
              const combined = [
                ...current,
                ...(backendDocuments as LocalDocument[]),
              ];

              const unique = new Map<string, LocalDocument>();

              combined.forEach((doc) => {
                const key = `${doc.filename}-${doc.id}`;

                if (!unique.has(key)) {
                  unique.set(key, doc);
                }
              });

              return Array.from(unique.values());
            });
          }
        } catch (refreshError) {
          console.log(
            "Backend refresh skipped:",
            refreshError
          );
        }
      } else {
        setUploadMessage(
          "Upload failed. Please check the backend connection."
        );
      }
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // =========================================================
  // OPEN FILE
  // =========================================================

  const openFile = (doc: LocalDocument) => {
    const url =
      doc.localUrl ||
      (doc as any).file_url ||
      (doc as any).url ||
      (doc as any).download_url ||
      (doc as any).path;

    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    if (doc.originalFile) {
      const objectUrl = URL.createObjectURL(
        doc.originalFile
      );

      window.open(
        objectUrl,
        "_blank",
        "noopener,noreferrer"
      );

      return;
    }

    alert("File URL is not available.");
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // =========================================================
  // FILE ICON
  // =========================================================

  const getFileIcon = (filename: string) => {
    const extension =
      filename.split(".").pop()?.toLowerCase();

    if (
      ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(
        extension || ""
      )
    ) {
      return (
        <ImageIcon className="w-7 h-7 text-purple-400" />
      );
    }

    if (extension === "pdf") {
      return (
        <FileText className="w-7 h-7 text-red-400" />
      );
    }

    if (
      ["ppt", "pptx"].includes(extension || "")
    ) {
      return (
        <Presentation className="w-7 h-7 text-orange-400" />
      );
    }

    if (
      ["zip", "rar", "7z"].includes(extension || "")
    ) {
      return (
        <FileArchive className="w-7 h-7 text-yellow-400" />
      );
    }

    if (
      ["py", "js", "ts", "jsx", "tsx", "json", "sql"].includes(
        extension || ""
      )
    ) {
      return (
        <Code2 className="w-7 h-7 text-cyan-400" />
      );
    }

    return (
      <File className="w-7 h-7 text-blue-400" />
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen w-full bg-[#020617] text-white overflow-x-hidden">

      {/* =====================================================
          BACKGROUND EFFECTS
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div
          className="
          absolute
          -top-40
          left-1/2
          -translate-x-1/2
          w-[700px]
          h-[500px]
          bg-indigo-600/10
          blur-[150px]
          rounded-full
          "
        />

        <div
          className="
          absolute
          top-[500px]
          -left-40
          w-[450px]
          h-[450px]
          bg-cyan-500/5
          blur-[140px]
          rounded-full
          "
        />

        <div
          className="
          absolute
          top-[900px]
          right-0
          w-[450px]
          h-[450px]
          bg-purple-600/5
          blur-[140px]
          rounded-full
          "
        />

      </div>


      {/* =====================================================
          TOP NAVBAR
      ====================================================== */}

      <header
        className="
        relative
        z-40
        w-full
        h-24
        border-b
        border-white/[0.08]
        bg-[#020617]/80
        backdrop-blur-2xl
        "
      >

        <div
          className="
          max-w-[1500px]
          mx-auto
          h-full
          px-6
          md:px-10
          flex
          items-center
          justify-between
          "
        >

          {/* BRAND */}

          <div className="flex items-center gap-4">

            <div
              className="
              w-14
              h-14
              rounded-2xl
              bg-gradient-to-br
              from-cyan-400
              via-blue-500
              to-purple-600
              flex
              items-center
              justify-center
              shadow-xl
              shadow-blue-500/20
              "
            >
              <Sparkles className="w-7 h-7 text-white" />
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                OmniMind AI
              </h1>

              <p className="text-xs text-slate-500">
                Your Second Brain
              </p>
            </div>

          </div>


          {/* RIGHT */}

          <div className="flex items-center gap-3">

            {/* ONLINE */}

            <div
              className="
              hidden
              md:flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              border
              border-emerald-400/20
              bg-emerald-400/5
              text-emerald-400
              text-xs
              "
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              System Online
            </div>


            {/* SETTINGS */}

            <button
              onClick={() =>
                setSettingsOpen(!settingsOpen)
              }
              className="
              w-11
              h-11
              rounded-xl
              border
              border-white/10
              bg-white/[0.03]
              hover:bg-white/[0.08]
              flex
              items-center
              justify-center
              transition
              "
            >
              <Settings className="w-5 h-5 text-slate-300" />
            </button>


            {/* USER */}

            <div
              className="
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              border
              border-white/10
              bg-white/[0.03]
              "
            >
              <User className="w-4 h-4 text-cyan-400" />

              <span className="text-sm font-medium">
                Adi
              </span>
            </div>


            {/* DROPDOWN */}

            {settingsOpen && (
              <div
                className="
                absolute
                top-20
                right-6
                md:right-10
                w-56
                p-2
                rounded-2xl
                border
                border-white/10
                bg-[#0b1220]
                shadow-2xl
                shadow-black/50
                "
              >

                <button
                  className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-slate-300
                  hover:bg-white/5
                  transition
                  "
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-red-400
                  hover:bg-red-500/10
                  transition
                  "
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>

              </div>
            )}

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <main
        className="
        relative
        z-10
        max-w-[1500px]
        mx-auto
        px-5
        md:px-10
        py-14
        "
      >

        {/* HERO */}

        <section className="text-center">

          <div
            className="
            inline-flex
            items-center
            gap-2
            px-5
            py-2
            rounded-full
            border
            border-cyan-400/20
            bg-cyan-400/[0.04]
            text-cyan-400
            text-sm
            mb-7
            "
          >
            <Sparkles className="w-4 h-4" />
            Instant Knowledge Finder
          </div>


          <h2
            className="
            text-5xl
            sm:text-6xl
            md:text-7xl
            font-black
            tracking-tight
            "
          >
            Find Your Files
          </h2>

          <h3
            className="
            text-5xl
            sm:text-6xl
            md:text-7xl
            font-black
            mt-2
            bg-gradient-to-r
            from-cyan-400
            via-blue-500
            to-purple-500
            bg-clip-text
            text-transparent
            "
          >
            In Seconds.
          </h3>


          <p
            className="
            max-w-2xl
            mx-auto
            mt-7
            text-slate-400
            text-base
            md:text-lg
            leading-8
            "
          >
            Store your important documents once and find
            them instantly whenever you need them.
          </p>


          {/* =================================================
              SEARCH BAR
          ================================================== */}

          <div
            className="
            relative
            max-w-4xl
            mx-auto
            mt-10
            "
          >

            <Search
              className="
              absolute
              left-6
              top-1/2
              -translate-y-1/2
              w-6
              h-6
              text-slate-500
              "
            />

            <input
              value={search}
              onChange={(e) =>
                handleSearchInput(
                  e.target.value,
                  setSearch
                )
              }
              placeholder="Search your files by name..."
              className="
              w-full
              h-16
              md:h-20
              pl-16
              pr-6
              rounded-2xl
              bg-white/[0.025]
              border
              border-white/10
              outline-none
              text-white
              text-base
              md:text-lg
              placeholder:text-slate-600
              focus:border-cyan-400/60
              focus:ring-4
              focus:ring-cyan-400/5
              transition-all
              "
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2
                text-slate-500
                hover:text-white
                "
              >
                <X className="w-5 h-5" />
              </button>
            )}

          </div>


          {/* =================================================
              BIG UPLOAD BUTTON
          ================================================== */}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept="
              .pdf,
              .doc,
              .docx,
              .ppt,
              .pptx,
              .txt,
              .md,
              .png,
              .jpg,
              .jpeg,
              .gif,
              .webp,
              .py,
              .js,
              .ts,
              .jsx,
              .tsx,
              .json,
              .sql,
              .zip,
              .rar
            "
            onChange={handleUpload}
          />

          <button
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={uploading}
            className="
            mt-7
            w-full
            max-w-3xl
            h-24
            md:h-28
            rounded-3xl
            bg-gradient-to-r
            from-indigo-600
            via-purple-600
            to-blue-600
            hover:scale-[1.01]
            active:scale-[0.99]
            transition-all
            shadow-2xl
            shadow-indigo-600/20
            flex
            items-center
            justify-center
            gap-5
            group
            "
          >

            <div
              className="
              w-14
              h-14
              rounded-2xl
              bg-white/15
              border
              border-white/20
              flex
              items-center
              justify-center
              "
            >
              {uploading ? (
                <RefreshCw className="w-7 h-7 animate-spin" />
              ) : (
                <Upload className="w-7 h-7" />
              )}
            </div>

            <div className="text-left">

              <div className="text-xl md:text-2xl font-bold">
                {uploading
                  ? "Uploading Files..."
                  : "Upload Files"}
              </div>

              <div className="text-sm text-white/60 mt-1">
                PDF • DOCX • PPT • Images • TXT • Code • ZIP
              </div>

            </div>

            <ExternalLink
              className="
              hidden
              md:block
              w-6
              h-6
              ml-5
              opacity-70
              group-hover:translate-x-1
              group-hover:-translate-y-1
              transition
              "
            />

          </button>


          {/* UPLOAD MESSAGE */}

          {uploadMessage && (
            <div
              className="
              max-w-3xl
              mx-auto
              mt-5
              px-5
              py-3
              rounded-xl
              border
              border-emerald-400/20
              bg-emerald-400/[0.04]
              text-emerald-400
              text-sm
              flex
              items-center
              justify-center
              gap-2
              "
            >
              <CheckCircle2 className="w-4 h-4" />
              {uploadMessage}
            </div>
          )}

        </section>


        {/* =====================================================
            STAT CARDS
        ====================================================== */}

        <section
          className="
          grid
          md:grid-cols-3
          gap-5
          mt-14
          "
        >

          {/* TOTAL */}

          <div
            className="
            group
            rounded-3xl
            border
            border-white/10
            bg-white/[0.025]
            p-7
            hover:border-cyan-400/20
            hover:bg-cyan-400/[0.02]
            transition-all
            "
          >

            <div className="flex justify-between">

              <div
                className="
                w-12
                h-12
                rounded-2xl
                bg-cyan-400/10
                flex
                items-center
                justify-center
                "
              >
                <FolderOpen className="w-6 h-6 text-cyan-400" />
              </div>

              <Database className="w-5 h-5 text-slate-700" />

            </div>

            <div className="text-4xl font-black mt-7">
              {documents.length}
            </div>

            <p className="text-slate-500 mt-1">
              Total Files
            </p>

          </div>


          {/* SEARCH */}

          <div
            className="
            group
            rounded-3xl
            border
            border-white/10
            bg-white/[0.025]
            p-7
            hover:border-purple-400/20
            transition-all
            "
          >

            <div className="flex justify-between">

              <div
                className="
                w-12
                h-12
                rounded-2xl
                bg-purple-400/10
                flex
                items-center
                justify-center
                "
              >
                <Search className="w-6 h-6 text-purple-400" />
              </div>

              <Clock3 className="w-5 h-5 text-slate-700" />

            </div>

            <div className="text-4xl font-black mt-7">
              {search
                ? searchResults.length
                : 0}
            </div>

            <p className="text-slate-500 mt-1">
              Search Results
            </p>

          </div>


          {/* STATUS */}

          <div
            className="
            group
            rounded-3xl
            border
            border-white/10
            bg-white/[0.025]
            p-7
            hover:border-blue-400/20
            transition-all
            "
          >

            <div className="flex justify-between">

              <div
                className="
                w-12
                h-12
                rounded-2xl
                bg-blue-400/10
                flex
                items-center
                justify-center
                "
              >
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>

              <span
                className="
                px-3
                py-1
                h-fit
                rounded-full
                bg-emerald-400/10
                text-emerald-400
                text-xs
                "
              >
                Active
              </span>

            </div>

            <div className="text-3xl font-black mt-7">
              Instant
            </div>

            <p className="text-slate-500 mt-1">
              File Discovery
            </p>

          </div>

        </section>


        {/* =====================================================
            FILE VAULT
        ====================================================== */}

        <section className="mt-16">

          <div
            className="
            flex
            flex-col
            md:flex-row
            md:items-center
            justify-between
            gap-5
            mb-7
            "
          >

            <div>

              <div className="flex items-center gap-3">

                <div
                  className="
                  w-11
                  h-11
                  rounded-xl
                  bg-cyan-400/10
                  flex
                  items-center
                  justify-center
                  "
                >
                  <FolderOpen className="w-5 h-5 text-cyan-400" />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold">
                  {search
                    ? "Search Results"
                    : "My File Vault"}
                </h2>

              </div>

              <p className="text-slate-500 mt-2 ml-14">

                {search
                  ? `${searchResults.length} file${
                      searchResults.length !== 1
                        ? "s"
                        : ""
                    } found for "${search}"`
                  : "All your uploaded files in one secure place"}

              </p>

            </div>


            <button
              onClick={loadDocuments}
              className="
              flex
              items-center
              justify-center
              gap-2
              px-5
              py-3
              rounded-xl
              border
              border-white/10
              bg-white/[0.03]
              hover:bg-white/[0.08]
              transition
              text-slate-300
              "
            >

              <RefreshCw
                className={`w-4 h-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />

              Refresh

            </button>

          </div>


          {/* SEARCH CLEAR */}

          {search && (
            <button
              onClick={() => setSearch("")}
              className="
              mb-5
              flex
              items-center
              gap-2
              text-sm
              text-slate-500
              hover:text-cyan-400
              transition
              "
            >
              <X className="w-4 h-4" />
              Clear search
            </button>
          )}


          {/* =================================================
              FILE LIST
          ================================================== */}

          {loading ? (

            <div
              className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.02]
              py-24
              text-center
              "
            >

              <RefreshCw
                className="
                w-10
                h-10
                mx-auto
                text-cyan-400
                animate-spin
                "
              />

              <p className="text-slate-500 mt-5">
                Loading your files...
              </p>

            </div>

          ) : searchResults.length === 0 ? (

            <div
              className="
              rounded-3xl
              border
              border-dashed
              border-white/10
              bg-white/[0.015]
              py-24
              text-center
              "
            >

              <div
                className="
                w-20
                h-20
                mx-auto
                rounded-3xl
                bg-white/[0.03]
                border
                border-white/10
                flex
                items-center
                justify-center
                "
              >
                <FolderOpen className="w-9 h-9 text-slate-600" />
              </div>

              <h3 className="text-xl font-semibold mt-6">
                {search
                  ? "No matching files"
                  : "Your File Vault is empty"}
              </h3>

              <p className="text-slate-600 mt-2">
                {search
                  ? "Try searching with another file name."
                  : "Upload your first document to get started."}
              </p>

            </div>

          ) : (

            <div className="grid gap-4">

              {searchResults.map((doc) => (

                <div
                  key={doc.id}
                  className="
                  group
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.025]
                  p-5
                  md:p-6
                  hover:bg-white/[0.045]
                  hover:border-cyan-400/30
                  transition-all
                  "
                >

                  <div
                    className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    justify-between
                    gap-5
                    "
                  >

                    {/* FILE INFO */}

                    <div className="flex items-center gap-4 min-w-0">

                      <div
                        className="
                        w-14
                        h-14
                        shrink-0
                        rounded-2xl
                        bg-white/[0.04]
                        border
                        border-white/10
                        flex
                        items-center
                        justify-center
                        group-hover:scale-105
                        transition
                        "
                      >
                        {getFileIcon(doc.filename)}
                      </div>

                      <div className="min-w-0">

                        <h3
                          className="
                          font-semibold
                          text-white
                          text-base
                          md:text-lg
                          truncate
                          group-hover:text-cyan-400
                          transition
                          "
                        >
                          {doc.filename}
                        </h3>

                        <div
                          className="
                          flex
                          items-center
                          gap-3
                          mt-2
                          text-xs
                          text-slate-500
                          "
                        >

                          <span className="uppercase">
                            {doc.file_type || "FILE"}
                          </span>

                          <span>•</span>

                          <span>
                            Stored in OmniMind
                          </span>

                        </div>

                      </div>

                    </div>


                    {/* OPEN BUTTON */}

                    <button
                      onClick={() => openFile(doc)}
                      className="
                      shrink-0
                      flex
                      items-center
                      justify-center
                      gap-2
                      px-5
                      py-3
                      rounded-xl
                      bg-gradient-to-r
                      from-indigo-600
                      to-purple-600
                      hover:from-indigo-500
                      hover:to-purple-500
                      font-medium
                      transition
                      shadow-lg
                      shadow-indigo-500/10
                      "
                    >

                      <ExternalLink className="w-4 h-4" />

                      Open File

                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* =====================================================
            BOTTOM INFO
        ====================================================== */}

        <section
          className="
          mt-16
          grid
          md:grid-cols-3
          gap-5
          "
        >

          <div
            className="
            rounded-2xl
            border
            border-white/10
            bg-white/[0.02]
            p-6
            "
          >
            <Sparkles className="w-6 h-6 text-cyan-400" />

            <h3 className="font-semibold mt-4">
              Instant Search
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Search your uploaded files by filename and
              find them immediately.
            </p>

          </div>


          <div
            className="
            rounded-2xl
            border
            border-white/10
            bg-white/[0.02]
            p-6
            "
          >
            <ShieldCheck className="w-6 h-6 text-emerald-400" />

            <h3 className="font-semibold mt-4">
              Your File Vault
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Keep your important study material organized
              in one place.
            </p>

          </div>


          <div
            className="
            rounded-2xl
            border
            border-white/10
            bg-white/[0.02]
            p-6
            "
          >
            <Clock3 className="w-6 h-6 text-purple-400" />

            <h3 className="font-semibold mt-4">
              Save Your Time
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              No need to search folders manually. Find the
              required document in seconds.
            </p>

          </div>

        </section>


        {/* FOOTER */}

        <footer
          className="
          mt-16
          pt-8
          pb-8
          border-t
          border-white/10
          text-center
          "
        >

          <p className="text-sm text-slate-600">
            © 2026 OmniMind AI — Your Second Brain
          </p>

          <p className="text-xs text-slate-700 mt-2">
            Intelligent File Discovery System
          </p>

        </footer>

      </main>

    </div>
  );
}


// =============================================================
// SEARCH HELPER
// =============================================================

function handleSearchInput(
  value: string,
  setSearch: React.Dispatch<React.SetStateAction<string>>
) {
  setSearch(value);
}