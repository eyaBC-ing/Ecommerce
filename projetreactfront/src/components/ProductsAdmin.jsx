import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const API_PRODUCTS_URL = 'http://localhost:8080/api/products';
const API_CATEGORIES_URL = 'http://localhost:8080/api/categories';

export default function ProductsAdmin() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const initialProductState = { id: null, name: '', description: '', price: 0, category: { id: '' } };
    const [currentProduct, setCurrentProduct] = useState(initialProductState);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                axios.get(API_PRODUCTS_URL),
                axios.get(API_CATEGORIES_URL)
            ]);
            setProducts(productsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error("Erreur de chargement", error);
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (product = null) => {
        if (product) {
            // Ensure category object exists for safety
            setCurrentProduct({
                ...product,
                category: product.category || { id: '' }
            });
        } else {
            setCurrentProduct(initialProductState);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentProduct(initialProductState);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Validate category
            if (!currentProduct.category.id) {
                alert("Veuillez sélectionner une catégorie valide");
                return;
            }

            const payload = {
                ...currentProduct,
                price: parseFloat(currentProduct.price),
                category: { id: parseInt(currentProduct.category.id) }
            };

            if (currentProduct.id) {
                await axios.put(`${API_PRODUCTS_URL}/${currentProduct.id}`, payload);
            } else {
                await axios.post(API_PRODUCTS_URL, payload);
            }

            fetchData();
            closeModal();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du produit", error);
            alert("Une erreur s'est produite lors de l'enregistrement.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            try {
                await axios.delete(`${API_PRODUCTS_URL}/${id}`);
                fetchData(); // reload
            } catch (error) {
                console.error("Erreur lors de la suppression", error);
            }
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Gestion des Produits</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} /> Nouveau Produit
                </button>
            </div>

            <div className="card">
                {isLoading ? (
                    <p>Chargement des produits...</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Produit</th>
                                    <th>Description</th>
                                    <th>Catégorie</th>
                                    <th>Prix</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>Aucun produit disponible.</td>
                                    </tr>
                                ) : (
                                    products.map(product => (
                                        <tr key={product.id}>
                                            <td>#{product.id}</td>
                                            <td style={{ fontWeight: 500 }}>{product.name}</td>
                                            <td style={{ color: "var(--text-muted)" }}>{product.description}</td>
                                            <td>
                                                <span className="badge">
                                                    {product.category ? product.category.name : 'Aucune'}
                                                </span>
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{product.price} €</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button className="btn-icon edit" onClick={() => openModal(product)}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="btn-icon delete" onClick={() => handleDelete(product.id)}>
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
                                {currentProduct.id ? 'Modifier le produit' : 'Nouveau produit'}
                            </h2>
                            <button className="btn-icon" onClick={closeModal}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Nom du produit</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={currentProduct.name}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                        required
                                        placeholder="Ex: Ordinateur portable"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        value={currentProduct.description}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                        rows="3"
                                        placeholder="Brève description..."
                                    ></textarea>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Prix (€)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            value={currentProduct.price}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Catégorie</label>
                                        <select
                                            className="form-control"
                                            value={currentProduct.category?.id || ''}
                                            onChange={(e) => setCurrentProduct({
                                                ...currentProduct,
                                                category: { id: e.target.value }
                                            })}
                                            required
                                        >
                                            <option value="" disabled>Sélectionner...</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={categories.length === 0}>
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
