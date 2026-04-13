import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const API_SUPPLIERS_URL = 'http://localhost:8080/api/suppliers';

export default function SuppliersAdmin() {
    const [suppliers, setSuppliers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const initialSupplierState = { id: null, name: '', contactInfo: '' };
    const [currentSupplier, setCurrentSupplier] = useState(initialSupplierState);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const getAuthHeaders = () => {
        const credentials = localStorage.getItem('authCredentials');
        if (credentials) {
            return { Authorization: `Basic ${credentials}` };
        }
        return {};
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(API_SUPPLIERS_URL);
            setSuppliers(res.data);
        } catch (error) {
            console.error("Erreur de chargement", error);
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (supplier = null) => {
        if (supplier) {
            setCurrentSupplier(supplier);
        } else {
            setCurrentSupplier(initialSupplierState);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentSupplier(initialSupplierState);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const headers = getAuthHeaders();
            if (currentSupplier.id) {
                await axios.put(`${API_SUPPLIERS_URL}/${currentSupplier.id}`, currentSupplier, { headers });
            } else {
                await axios.post(API_SUPPLIERS_URL, currentSupplier, { headers });
            }
            fetchData();
            closeModal();
        } catch (error) {
            console.error("Erreur d'enregistrement", error);
            if (error.response && error.response.status === 401) {
                alert("Non autorisé ! Veuillez vous connecter en tant qu'administrateur.");
            } else {
                alert("Une erreur est survenue.");
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
            try {
                const headers = getAuthHeaders();
                await axios.delete(`${API_SUPPLIERS_URL}/${id}`, { headers });
                fetchData();
            } catch (error) {
                console.error("Erreur de suppression", error);
                if (error.response && error.response.status === 401) {
                    alert("Non autorisé !");
                }
            }
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Gestion des Fournisseurs</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} /> Nouveau Fournisseur
                </button>
            </div>

            <div className="card">
                {isLoading ? (
                    <p>Chargement...</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nom</th>
                                    <th>Contact</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center' }}>Aucun fournisseur.</td>
                                    </tr>
                                ) : (
                                    suppliers.map(sup => (
                                        <tr key={sup.id}>
                                            <td>#{sup.id}</td>
                                            <td style={{ fontWeight: 500 }}>{sup.name}</td>
                                            <td>{sup.contactInfo}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button className="btn-icon edit" onClick={() => openModal(sup)}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="btn-icon delete" onClick={() => handleDelete(sup.id)}>
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
                                {currentSupplier.id ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
                            </h2>
                            <button className="btn-icon" onClick={closeModal}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Nom</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={currentSupplier.name}
                                        onChange={(e) => setCurrentSupplier({ ...currentSupplier, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Contact (Email, Tél...)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={currentSupplier.contactInfo}
                                        onChange={(e) => setCurrentSupplier({ ...currentSupplier, contactInfo: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                                <button type="submit" className="btn btn-primary">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
