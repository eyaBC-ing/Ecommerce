package org.example.projetreactback.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "paniers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Panier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToMany
    @JoinTable(name = "panier_ligne_commande", joinColumns = @JoinColumn(name = "panier_id"), inverseJoinColumns = @JoinColumn(name = "ligne_commande_id"))
    @JsonIgnoreProperties("paniers")
    private List<LigneCommande> ligneCommandes;
}
