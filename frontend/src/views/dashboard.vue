<template>
  <Layout>
    <div class="">
      <h1 class="welcome"> <span>welcome, </span> {{ user && user.username }} </h1>

      <div class="balances">
        <div v-if="loading">
          loading balances...
        </div>
        <div v-else class="balance" :key="item[0]" v-for="item in balances">
          <span class="currency">{{ item[0] }}</span>
          <div class="amount">{{ item[1] }}</div>
        </div>
      </div>

      <div class="transactions-container">
        <div class="transfer">
          <div class="header">
            <div class="top-text">send some cash...</div>
          </div>
          <form @submit.prevent="sendMoney">
            <span>
              i want to send
            </span>
            <div class="input-group">
              <Input
                :value="amount"
                @update:value="amount = $event"
                placeholder="amount to send"
                type="number"
              />
              <select v-model="from_currency" name="" id="">
                <option value="" selected disabled>--- from which currency ---</option>
                <option value="USD">USD</option>
                <option value="NGN">NGN</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <span>to be receieved as</span>
            <select v-model="to_currency" name="" id="">
              <option value="" selected disabled>--- to which currency ---</option>
              <option value="USD">USD</option>
              <option value="NGN">NGN</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
            </select>
            <span>
              to be received by
            </span>
            <select v-model="receipient" name="" id="">
              <option value="" selected disabled>--- select receipient ---</option>
              <option
                :key="user.username"
                v-for="user in users"
                :value="user.email"
              >
                [{{ user.email }}] - {{ user.username }}
              </option>
            </select>
            <Button classNames="" type="submit">send this cash!</Button>
          </form>
        </div>

        <div class="transactions">
          <div class="header">
            <div class="top-text">transactions</div>
          </div>

          <div v-if="loading">
            loading transactions...
          </div>
          <div
            v-else
            :class="['transaction', item.senderId === user.email ? 'withdraw' : 'deposit']"
            :key="item._id" v-for="item in transactions"
          >
            <div class="transaction-half">
              <div class="transaction-description">
                <span v-if="item.senderId === user.email">You</span>
                <span v-else>{{ item.senderId || 'Bank' }}</span>
                sent
              </div>
              <span class="transaction-amount">{{ item.from_value }}{{ item.origin_currency }}</span>
            </div>

            <div class="transaction-middle">
              {{ (new Date(item.created_at)).toDateString() }}
            </div>

            <div class="transaction-half">
              <div class="transaction-description">
                <span v-if="item.senderId === user.email">{{ item.receiverId }}</span>
                <span v-else> You </span>
                received
              </div>
              <span class="transaction-amount">{{ item.to_value }}{{ item.destination_currency }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/views/layout.vue";
import Input from "@/components/Input.vue";
import Button from "@/components/button.vue";

export default {
  components: { Layout, Button, Input },
  inject: ['notify'],
  data() {
    return {
      transactions: [],
      balance: null,
      users: [],
      from_currency: '',
      to_currency: '',
      amount: 0,
      receipient: '',
      rate: 1
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    balances() {
      return Object.entries(this.balance || {})
    },
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    async dash() {
      const dashboard = await this.$store.dispatch('dashboard_details')

      if(dashboard) {
        this.transactions = dashboard.transactions
        this.balance = dashboard.balance
        this.users = dashboard.users
      }
    },
    async sendMoney() {
      const { from_currency, to_currency, amount, receipient } = this;
      if(!from_currency || !to_currency || amount === 0 || !receipient) {
        this.notify({ type: 'error', message: 'you have missing fields to fill!' })
        return;
      }

      this.notify({
        type: 'info',
        message: `your request is processing... please wait.`
      })

      const trans = await this.$store.dispatch('create_transaction', {
        origin_currency: this.from_currency,
        destination_currency: this.to_currency,
        value: this.amount,
        receipient: this.receipient
      });
      if(trans.error) {
        this.notify({ type: 'error', message: trans.message })
        return;
      }

      const { destination_currency, origin_currency, from_value, to_value } = trans.transaction
      this.notify({
        type: 'success',
        message: `successfully transfered ${from_value}${origin_currency}(${to_value}${destination_currency}) to ${receipient}!`
      });
      this.resetTransferForm();
      this.dash();
    },
    resetTransferForm() {
      this.from_currency = '';
      this.to_currency = '';
      this.amount = 0;
      this.receipient = '';
      this.rate = '';
    }
  },
  mounted() {
    this.dash();
  },
}
</script>

<style lang="scss" scoped>
.welcome {
  font-size: 3rem;

  span {
    font-size: 2.5rem;
    color: var(--blue-dark);
  }
}

.balances {
  width: 100%;
  padding: 0.5rem 0;
  margin: 1rem 0;
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;

  .balance {
    display: flex;
    align-items: first baseline;
    background: var(--blue-light);
    color: var(--blue-dark);
    padding: 1.3rem 1.5rem;
    border-radius: 1rem;

    .amount {
      font-size: 3rem;
    }
    .currency {
      text-transform: uppercase;
      font-size: 1rem;
      // transform: rotate(-90deg);
      display: block;
      max-width: max-content;
      height: max-content;
      margin-right: 0.5rem;
    }
  }

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 960px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;

  .top-text {
    font-size: 1.8rem;
  }

  &::after {
    content: '___';
    position: absolute;
    bottom: -10px;
  }
}

.transactions-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  .transfer {
    margin: 2rem 0;

    form {
      display: flex;
      flex-direction: column;

      .input-group {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      > span {
        margin-bottom: 0.2rem;
      }

      select, input {
        padding: 0.7rem;
        margin-bottom: 1rem;
        background: white;
        border: 2px solid #bcc6af;
        border-radius: 3px;
      }
    }
  }

  .transactions {
    margin: 2rem 0;
    max-height: 30rem;
    overflow-y: scroll;

    .transaction {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      align-items: center;
      padding: 1.2rem;
      margin: 1rem 0;
      background: #e7f9cd;
      color: var(--green-dark);
      border-radius: 1rem;

      &.withdraw {
        background: var(--red-light);
        color: var(--red-dark);
      }

      &.deposit {
        background: var(--green-light);
        color: var(--green-dark);
      }

      .transaction-half {
        .transaction-amount {
          font-size: 1.8rem
        }

        .transaction-description {
          font-size: 1.3rem;
        }
      }

      .transaction-middle {
        height: max-content;
        text-align: center;
      }

      .transaction-half:first-child {
        text-align: left;
      }

      .transaction-half:last-child {
        text-align: right;
      }
    }
  }

  @media (min-width: 380px) {
    grid-template-columns: 1fr 2fr;
  }

  @media (min-width: 1280px) {
    .transactions .transaction {
      grid-template-columns: 2fr 1fr 2fr;
    }
  }
}
</style>
