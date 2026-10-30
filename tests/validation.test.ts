import {describe,it,expect} from 'vitest';import {createValidation as enquiry} from '../src/modules/enquiries/enquiry.validation';import {createValidation as contact} from '../src/modules/contact/contact.validation';
const valid={name:'Test Customer',phone:'+971 50 123 4567',email:'',area:'Dubai',message:'',website:''};
describe('public form contracts',()=>{
 it('accepts the puppy profile enquiry field set and UUID',()=>{const {error}=enquiry.body.validate({...valid,puppyId:'4218427a-dd65-4b09-a089-584b912aa7ab'});expect(error).toBeUndefined();});
 it('rejects a missing required enquiry name',()=>{const {error}=enquiry.body.validate({phone:valid.phone,puppyId:'4218427a-dd65-4b09-a089-584b912aa7ab'});expect(error).toBeDefined();});
 it('rejects invalid enquiry UUID',()=>{const {error}=enquiry.body.validate({...valid,puppyId:'not-an-id'});expect(error).toBeDefined();});
 it('accepts the contact form with no puppy selected',()=>{const {error}=contact.body.validate({...valid,puppyId:''});expect(error).toBeUndefined();});
 it('rejects overlong message',()=>{const {error}=contact.body.validate({...valid,puppyId:'',message:'x'.repeat(2001)});expect(error).toBeDefined();});
});
