export interface RegionDetailExtra {
  azCount: number;
  lanzamiento: string;
  certificaciones: string[];
  recomendadaPara: string[];
}

export const regionDetails: Record<string, RegionDetailExtra> = {
  "us-east-1": {
    azCount: 6,
    lanzamiento: "2006",
    certificaciones: ["SOC 1/2/3", "PCI DSS", "HIPAA", "ISO 27001", "FedRAMP"],
    recomendadaPara: ["Estados Unidos (costa este)", "Canadá"],
  },
  "us-west-2": {
    azCount: 4,
    lanzamiento: "2011",
    certificaciones: ["SOC 1/2/3", "PCI DSS", "HIPAA", "ISO 27001"],
    recomendadaPara: ["Estados Unidos (costa oeste)", "México"],
  },
  "sa-east-1": {
    azCount: 3,
    lanzamiento: "2011",
    certificaciones: ["SOC 1/2/3", "PCI DSS", "ISO 27001"],
    recomendadaPara: ["Brasil", "Argentina", "Perú", "Chile"],
  },
  "eu-west-1": {
    azCount: 3,
    lanzamiento: "2007",
    certificaciones: ["SOC 1/2/3", "PCI DSS", "HIPAA", "ISO 27001", "GDPR-ready"],
    recomendadaPara: ["Irlanda", "Reino Unido", "Europa Occidental"],
  },
};