import { useEffect, useState } from 'react';

/**
 * Service interface for grouping
 */
interface Service {
  id: number;
  name: string;
  categoryName: string;
  duration: number;
  price: number;
}

/**
 * Grouped service option
 */
interface ServiceOption {
  label: string;
  value: number;
  duration: number;
  price: number;
  category?: GroupedService;
}

/**
 * Grouped service category
 */
interface GroupedService {
  label: string;
  options: ServiceOption[];
}

/**
 * Hook to group services by category
 * @param services Array of services to group
 * @returns Array of grouped services by category
 */
const useGroupedServices = (services: Service[]): GroupedService[] => {
  const [groupedServices, setGroupedServices] = useState<GroupedService[]>([]);

  useEffect(() => {
    const newGroupedServices =
      services &&
      services.reduce((acc: GroupedService[], service) => {
        // Find an existing category in the accumulator
        const category = acc.find((category) => category.label === service.categoryName);

        // Create the service option
        const serviceOption: ServiceOption = {
          label: service.name,
          value: service.id,
          duration: service.duration,
          price: service.price,
          category: category
        };

        if (category) {
          // If the category exists, push the new service into it
          category.options.push(serviceOption);
        } else {
          // Otherwise, create a new category with the service
          acc.push({
            label: service.categoryName,
            options: [serviceOption]
          });
        }

        return acc;
      }, []);

    setGroupedServices(newGroupedServices);
  }, [services]);

  return groupedServices;
};

export default useGroupedServices;
export type { Service, ServiceOption, GroupedService };
