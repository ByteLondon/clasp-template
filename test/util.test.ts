import { expect } from 'chai'
import { camelize } from '../src/util'

describe('It should camelize Correctly', () => {
  it('should Camelize Correctly', () => {
    expect(camelize('Listing: Title')).to.equal('listingTitle')
    expect(camelize('Status')).to.equal('status')
    expect(camelize('Tenancy: Status')).to.equal('tenancyStatus')
    expect(camelize('ListingID')).to.equal('listingID')
    expect(camelize('Tenancy: Rental Frequency')).to.equal('tenancyRentalFrequency')
    expect(camelize('Tenancy: Rent')).to.equal('tenancyRent')
    expect(camelize('Non-resident Landlord')).to.equal('nonResidentLandlord')
    expect(camelize('Tenancy: Contract Duration (Months)')).to.equal('tenancyContractDurationMonths')
    expect(camelize('Move in Date')).to.equal('moveInDate')
    expect(camelize('Tenancy End Date')).to.equal('tenancyEndDate')
    expect(camelize('Tenancy: Number of Tenants')).to.equal('tenancyNumberOfTenants')
    expect(camelize('Tenancy: Lead Tenant')).to.equal('tenancyLeadTenant')
  })
})
