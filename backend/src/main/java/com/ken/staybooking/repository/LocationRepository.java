package com.laioffer.staybooking.repository;

import com.laioffer.staybooking.entity.Location;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends ElasticsearchRepository<Location, Long>,
        CustomLocationRepository {
    // 这里extends了两个，这里就绕过了父类继承爷爷类也要override的问题

}
