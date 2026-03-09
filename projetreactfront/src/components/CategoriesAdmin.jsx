import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const API_URL = 'http://localhost:8080/api/categories';

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories", error);
      alert("Le serveur backend ne semble pas être allumé (port 8080).");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (category = { id: null, name: '' }) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCategory({ id: null, name: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentCategory.id) {
        // Update
        await axios.put(`${API_URL}/${currentCategory.id}`, currentCategory);
      } else {
        // Create
        await axios.post(API_URL, currentCategory);
      }
      fetchCategories();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement", error);
      alert("Erreur lors de l'enregistrement. Vérifiez que le backend est bien lancé.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Erreur lors de la suppression", error);
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestion des Catégories</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Nouvelle Catégorie
        </button>
      </div>

      <div className="card">
        {isLoading ? (
          <p>Chargement des catégories...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom de la catégorie</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center' }}>Aucune catégorie trouvée.</td>
                  </tr>
                ) : (
                  categories.map(category => (
                    <tr key={category.id}>
                      <td>#{category.id}</td>
                      <td>{category.name}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn-icon edit" onClick={() => openModal(category)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDelete(category.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {currentCategory.id ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>
              <button className="btn-icon" onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nom de la catégorie</label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentCategory.name}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                    required
                    placeholder="Ex: Électronique"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
