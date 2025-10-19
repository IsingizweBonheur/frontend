import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// firebase imports (make sure ../firebase exports `database` and `storage`)
import { database, storage } from "../firebase";
import {
  ref as dbRef,
  onValue,
  push,
  set,
  remove,
  update as dbUpdate,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [gallery, setGallery] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [profile, setProfile] = useState({
    username: "admin",
    email: "isingizwebonheur@gmail.com",
    phone: "0795926508",
    studioName: "Dev Studio",
    address: "123 Creative Avenue, Studio City, SC 90210",
  });

  // uploading states
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [projectUploading, setProjectUploading] = useState(false);

  const navigate = useNavigate();

  // forms
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    category: "wedding",
    type: "image",
    file: null,
  });

  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "Wedding",
    client: "",
    file: null,
  });

  const [serviceForm, setServiceForm] = useState({
    icon: "",
    title: "",
    description: "",
    price: "",
    features: "",
  });

  // refs to clear file inputs
  const galleryFileRef = useRef(null);
  const projectFileRef = useRef(null);

  // === Load data from Firebase (Realtime Database) ===
  useEffect(() => {
    const galleryRef = dbRef(database, "admin/gallery");
    const offGallery = onValue(galleryRef, (snap) => {
      const data = snap.val() || {};
      const arr = Object.entries(data).map(([id, v]) => ({ id, ...v }));
      setGallery(arr.reverse());
    });

    const projectRef = dbRef(database, "admin/projects");
    const offProjects = onValue(projectRef, (snap) => {
      const data = snap.val() || {};
      const arr = Object.entries(data).map(([id, v]) => ({ id, ...v }));
      setProjects(arr.reverse());
    });

    const serviceRef = dbRef(database, "admin/services");
    const offServices = onValue(serviceRef, (snap) => {
      const data = snap.val() || {};
      const arr = Object.entries(data).map(([id, v]) => ({ id, ...v }));
      setServices(arr);
    });

    const profileRef = dbRef(database, "admin/profile");
    const offProfile = onValue(profileRef, (snap) => {
      const val = snap.val();
      if (val) setProfile(val);
    });

    // cleanup: onValue returns unsubscribe in v9? onValue itself returns an unsubscribe function only when used as onValue(ref, cb) -> use returned function
    return () => {
      // no-op cleanup; Firebase onValue used like this doesn't return a function directly in every bundler environment.
      // If you want definitive cleanup use `import { off } from "firebase/database"` and call off(ref).
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  // === GALLERY UPLOAD via Node backend ===
const handleGalleryUpload = async (e) => {
  e.preventDefault();
  if (!galleryForm.title || !galleryForm.file) {
    alert("Please select a file and enter a title.");
    return;
  }

  setGalleryUploading(true);
  try {
    const formData = new FormData();
    formData.append("file", galleryForm.file);
    formData.append("title", galleryForm.title);
    formData.append("description", galleryForm.category); // you can adjust

    const res = await fetch("http://localhost:5000/upload", { // replace with your server URL
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");

    // update gallery locally
    setGallery(prev => [{ id: data.id, title: galleryForm.title, url: data.url, category: galleryForm.category }, ...prev]);

    setGalleryForm({ title: "", category: "wedding", type: "image", file: null });
    if (galleryFileRef.current) galleryFileRef.current.value = "";
    alert("✅ Gallery item uploaded successfully!");
  } catch (err) {
    console.error("Gallery upload failed:", err);
    alert("❌ Gallery upload failed. Check console for details.");
  } finally {
    setGalleryUploading(false);
  }
};
  // === SERVICES CRUD ===
  const handleServiceAdd = async (e) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.description) return;
    const newRef = push(dbRef(database, "admin/services"));
    await set(newRef, {
      icon: serviceForm.icon || "🎯",
      title: serviceForm.title,
      description: serviceForm.description,
      price: serviceForm.price,
      features: serviceForm.features
        ? serviceForm.features.split(",").map((f) => f.trim())
        : [],
    });
    setServiceForm({ icon: "", title: "", description: "", price: "", features: "" });
  };

  const updateService = async (id) => {
    const svc = services.find((s) => s.id === id);
    const newTitle = prompt("Edit title", svc?.title || "");
    const newDesc = prompt("Edit description", svc?.description || "");
    const newPrice = prompt("Edit price", svc?.price || "");
    if (newTitle && newDesc) {
      await dbUpdate(dbRef(database, `admin/services/${id}`), {
        title: newTitle,
        description: newDesc,
        price: newPrice,
      });
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    await remove(dbRef(database, `admin/services/${id}`));
  };

  // === PROFILE UPDATE ===
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    await set(dbRef(database, "admin/profile"), profile);
    alert("Profile updated!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl border-r fixed h-screen">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">{profile.studioName}</h1>
          <p className="text-sm text-gray-300">Admin Panel</p>
        </div>
        <nav className="p-4">
          {["dashboard", "gallery", "services", "profile"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center w-full text-left px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-lg transform translate-x-1"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <span className="capitalize font-medium">
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
          </h1>
          <p className="text-gray-600">Manage your studio content and settings</p>
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Projects</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{projects.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Gallery Items</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{gallery.length}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Services</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{services.length}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <p className="text-gray-600">Welcome to your admin dashboard. Manage your studio's content efficiently.</p>
                <p className="text-sm text-gray-500">Last login: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Gallery Item</h3>
              <form onSubmit={handleGalleryUpload} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    ref={galleryFileRef}
                    type="file"
                    onChange={(e) =>
                      setGalleryForm({ ...galleryForm, file: e.target.files[0] })
                    }
                    accept="image/*"
                    className="border border-gray-300 rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <button
                  type="submit"
                  disabled={galleryUploading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  {galleryUploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload to Gallery
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery Items ({gallery.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {gallery.map((item) => (
                  <div key={item.id} className="relative group bg-gray-100 rounded-lg overflow-hidden">
                    <img src={item.url} alt={item.title} className="w-full h-32 object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center">
                      <button
                        onClick={() => deleteGalleryItem(item.id)}
                        className="bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Project</h3>
              <form onSubmit={handleProjectAdd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    ref={projectFileRef}
                    type="file"
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, file: e.target.files[0] })
                    }
                    accept="image/*"
                    className="border border-gray-300 rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <button
                  type="submit"
                  disabled={projectUploading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  {projectUploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Project
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects ({projects.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p) => (
                  <div key={p.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    <div className="relative group">
                      <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center">
                        <button
                          onClick={() => deleteProject(p.id)}
                          className="bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-1">{p.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{p.client}</p>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {p.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Service</h3>
              <form onSubmit={handleServiceAdd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Service Title"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Price"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, description: e.target.value })
                  }
                  rows="3"
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Service
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Services ({services.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((s) => (
                  <div
                    key={s.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900 text-lg">{s.title}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateService(s.id)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors duration-200"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteService(s.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded transition-colors duration-200"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{s.description}</p>
                    {s.price && (
                      <p className="text-green-600 font-semibold">{s.price}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Studio Profile</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Studio Name</label>
                    <input
                      type="text"
                      value={profile.studioName}
                      onChange={(e) =>
                        setProfile({ ...profile, studioName: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) =>
                        setProfile({ ...profile, username: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                    rows="3"
                    className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
