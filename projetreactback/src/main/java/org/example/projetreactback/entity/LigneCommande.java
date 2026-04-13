package org.example.projetreactback.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "ligne_commandes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LigneCommande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToMany
    @JoinTable(name = "ligne_commande_product", joinColumns = @JoinColumn(name = "ligne_commande_id"), inverseJoinColumns = @JoinColumn(name = "product_id"))
    @JsonIgnoreProperties("ligneCommandes")
    private List<Product> products;

    @ManyToMany(mappedBy = "ligneCommandes")
    @JsonIgnoreProperties("ligneCommandes")
    private List<Panier> paniers;
}
